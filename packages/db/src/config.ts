import type { Config } from "drizzle-kit";

import { dbEnv } from "./env";

export default {
  dialect: "sqlite",
  schema: "./src/schema",
  out: "./src/migrations",
  driver: "turso",
  dbCredentials: {
    url: dbEnv.TURSO_DATABASE_URL,
    authToken: dbEnv.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
