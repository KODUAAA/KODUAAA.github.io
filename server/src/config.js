// All settings come from environment variables. See .env.example for descriptions.

const list = (value) =>
  (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const loadConfig = (env = process.env) => ({
  port: Number(env.PORT) || 3000,
  isProduction: env.NODE_ENV === "production",

  // Sites allowed to call the API from a browser (your portfolio's URL).
  allowedOrigins: list(env.ALLOWED_ORIGINS || "http://localhost:5500,http://127.0.0.1:5500"),

  // PostgreSQL connection string. Empty = store messages in a local file (development only).
  databaseUrl: env.DATABASE_URL || "",
  localStorePath: env.LOCAL_STORE_PATH || "data/messages.jsonl",

  // Email notifications via Resend (https://resend.com). Empty = log to the console instead.
  resendApiKey: env.RESEND_API_KEY || "",
  notifyTo: env.NOTIFY_TO || "",
  notifyFrom: env.NOTIFY_FROM || "Portfolio <onboarding@resend.dev>",

  // Max contact submissions per IP address in each window.
  rateLimitMax: Number(env.RATE_LIMIT_MAX) || 5,
  rateLimitWindowMs: Number(env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000
});
