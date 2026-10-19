import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../src/app.js";
import { createFileStore } from "../src/store.js";
import { loadConfig } from "../src/config.js";
import { validateContact } from "../src/validate.js";

const valid = {
  name: "Ama Mensah",
  email: "ama@example.com",
  subject: "NSS placement",
  message: "Hello Bright, we'd like to talk about a placement."
};

const startServer = async (overrides = {}, { failMail = false } = {}) => {
  const dir = await mkdtemp(join(tmpdir(), "contact-api-"));
  const config = { ...loadConfig({}), localStorePath: join(dir, "messages.jsonl"), ...overrides };
  const store = await createFileStore(config.localStorePath);
  const sent = [];
  const mailer = {
    kind: "fake",
    notify: async (msg, id) => {
      if (failMail) throw new Error("email provider down");
      sent.push({ msg, id });
    }
  };
  const logger = { error: () => {} };
  const server = createApp({ config, store, mailer, logger }).listen(0);
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, headers = {}) =>
    fetch(`${base}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body)
    });
  const stop = async () => { server.close(); await rm(dir, { recursive: true, force: true }); };
  return { base, post, sent, config, stop };
};

describe("POST /api/contact", () => {
  let api;
  before(async () => { api = await startServer(); });
  after(() => api.stop());

  test("saves a valid message and sends a notification", async () => {
    const res = await api.post(valid);
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.ok(body.id);

    const lines = (await readFile(api.config.localStorePath, "utf8")).trim().split("\n");
    const saved = JSON.parse(lines.at(-1));
    assert.equal(saved.email, "ama@example.com");
    assert.equal(api.sent.at(-1).msg.subject, "NSS placement");
  });

  test("rejects invalid fields with per-field errors", async () => {
    const res = await api.post({ name: "A", email: "not-an-email", subject: "", message: "short" });
    assert.equal(res.status, 400);
    const { errors } = await res.json();
    assert.deepEqual(Object.keys(errors).sort(), ["email", "message", "name", "subject"]);
  });

  test("silently accepts but drops honeypot submissions", async () => {
    const before = api.sent.length;
    const res = await api.post({ ...valid, _gotcha: "http://spam.example" });
    assert.equal(res.status, 201);
    assert.equal(api.sent.length, before, "no notification for bots");
  });

  test("rejects malformed JSON without crashing", async () => {
    const res = await api.post("{not json");
    assert.equal(res.status, 400);
  });

  test("rejects oversized bodies", async () => {
    const res = await api.post({ ...valid, message: "x".repeat(20_000) });
    assert.equal(res.status, 413);
  });
});

describe("protection", () => {
  test("rate limits repeated submissions from one IP", async () => {
    const api = await startServer({ rateLimitMax: 2 });
    try {
      assert.equal((await api.post(valid)).status, 201);
      assert.equal((await api.post(valid)).status, 201);
      assert.equal((await api.post(valid)).status, 429);
    } finally {
      await api.stop();
    }
  });

  test("only allows CORS from configured origins", async () => {
    const api = await startServer({ allowedOrigins: ["https://bright.example"] });
    try {
      const ok = await fetch(`${api.base}/api/health`, { headers: { Origin: "https://bright.example" } });
      assert.equal(ok.headers.get("access-control-allow-origin"), "https://bright.example");
      const bad = await fetch(`${api.base}/api/health`, { headers: { Origin: "https://evil.example" } });
      assert.equal(bad.headers.get("access-control-allow-origin"), null);
    } finally {
      await api.stop();
    }
  });

  test("still succeeds if the email notification fails (message is already saved)", async () => {
    const api = await startServer({}, { failMail: true });
    try {
      const res = await api.post(valid);
      assert.equal(res.status, 201);
      const lines = (await readFile(api.config.localStorePath, "utf8")).trim().split("\n");
      assert.equal(lines.length, 1);
    } finally {
      await api.stop();
    }
  });
});

describe("validateContact", () => {
  test("strips control characters from single-line fields (no header injection)", () => {
    const result = validateContact({ ...valid, subject: "Hi\r\nBcc: victim@example.com" });
    assert.equal(result.ok, true);
    assert.ok(!/[\r\n]/.test(result.data.subject));
  });

  test("keeps line breaks in the message body", () => {
    const result = validateContact({ ...valid, message: "Line one\nLine two is here" });
    assert.equal(result.data.message, "Line one\nLine two is here");
  });

  test("handles a missing body", () => {
    assert.equal(validateContact(undefined).ok, false);
  });
});
