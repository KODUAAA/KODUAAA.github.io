import express from "express";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { validateContact, isHoneypotTripped } from "./validate.js";

/**
 * Builds the Express app. Store and mailer are passed in so tests can use fakes.
 */
export const createApp = ({ config, store, mailer, logger = console }) => {
  const app = express();

  // Render, Railway etc. sit behind one proxy; needed so rate limiting sees the real client IP.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => cb(null, !origin || config.allowedOrigins.includes(origin)),
      methods: ["GET", "POST"],
      maxAge: 86400
    })
  );
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", async (_req, res) => {
    try {
      await store.ping();
      res.json({ ok: true, store: store.kind, mailer: mailer.kind });
    } catch {
      res.status(503).json({ ok: false });
    }
  });

  const contactLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    limit: config.rateLimitMax,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { ok: false, error: "Too many messages. Please try again later or email me directly." }
  });

  app.post("/api/contact", contactLimiter, async (req, res) => {
    // Pretend success so bots don't learn they were caught.
    if (isHoneypotTripped(req.body)) return res.status(201).json({ ok: true });

    const result = validateContact(req.body);
    if (!result.ok) return res.status(400).json({ ok: false, errors: result.errors });

    let saved;
    try {
      saved = await store.save(result.data);
    } catch (err) {
      logger.error("Failed to save message:", err);
      return res.status(500).json({ ok: false, error: "Could not send your message. Please email me directly." });
    }

    // The message is already safe in the database; a failed notification shouldn't fail the request.
    try {
      await mailer.notify(result.data, saved.id);
    } catch (err) {
      logger.error(`Saved message #${saved.id} but notification failed:`, err.message);
    }

    res.status(201).json({ ok: true, id: saved.id });
  });

  app.use((_req, res) => res.status(404).json({ ok: false, error: "Not found" }));

  // Malformed JSON, oversized bodies and anything unexpected.
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500) logger.error(err);
    res.status(status).json({ ok: false, error: status === 413 ? "Message too large." : status < 500 ? "Bad request." : "Server error." });
  });

  return app;
};
