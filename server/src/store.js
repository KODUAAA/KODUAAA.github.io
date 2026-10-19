// Where messages are saved.
// Production: PostgreSQL (DATABASE_URL). Local development: a JSON-lines file.

import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id          BIGSERIAL PRIMARY KEY,
    name        TEXT        NOT NULL,
    email       TEXT        NOT NULL,
    subject     TEXT        NOT NULL,
    message     TEXT        NOT NULL,
    handled     BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages (created_at DESC);
`;

export const createPostgresStore = async (databaseUrl) => {
  const { default: pg } = await import("pg");
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 5 });
  await pool.query(SCHEMA);

  return {
    kind: "postgres",
    async save({ name, email, subject, message }) {
      // Parameterised query: user input is never concatenated into SQL.
      const { rows } = await pool.query(
        `INSERT INTO contact_messages (name, email, subject, message)
         VALUES ($1, $2, $3, $4)
         RETURNING id, created_at`,
        [name, email, subject, message]
      );
      return { id: String(rows[0].id), createdAt: rows[0].created_at.toISOString() };
    },
    async ping() {
      await pool.query("SELECT 1");
    },
    close: () => pool.end()
  };
};

export const createFileStore = async (path) => {
  await mkdir(dirname(path), { recursive: true });
  let nextId = 1;
  try {
    nextId = (await readFile(path, "utf8")).split("\n").filter(Boolean).length + 1;
  } catch {
    // file doesn't exist yet
  }

  return {
    kind: "file",
    async save(msg) {
      const record = { id: String(nextId++), createdAt: new Date().toISOString(), ...msg, handled: false };
      await appendFile(path, JSON.stringify(record) + "\n", "utf8");
      return { id: record.id, createdAt: record.createdAt };
    },
    async ping() {},
    close: async () => {}
  };
};

export const createStore = (config) =>
  config.databaseUrl ? createPostgresStore(config.databaseUrl) : createFileStore(config.localStorePath);
