import { loadConfig } from "./config.js";
import { createStore } from "./store.js";
import { createMailer } from "./mailer.js";
import { createApp } from "./app.js";

const config = loadConfig();

if (config.isProduction && !config.databaseUrl) {
  console.error("DATABASE_URL is required in production (the local file store is wiped on every deploy).");
  process.exit(1);
}

const store = await createStore(config);
const mailer = createMailer(config);
const app = createApp({ config, store, mailer });

const server = app.listen(config.port, () => {
  console.log(`Contact API on http://localhost:${config.port}  (store: ${store.kind}, mailer: ${mailer.kind})`);
  console.log(`Allowed origins: ${config.allowedOrigins.join(", ")}`);
});

const shutdown = () => {
  server.close(async () => {
    await store.close();
    process.exit(0);
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
