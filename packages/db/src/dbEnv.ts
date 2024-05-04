import type { Config } from "drizzle-kit";
import { createEnv } from "@t3-oss/env-core";
import * as z from "zod";
import { createClient } from "@libsql/client";

export const dbEnv = createEnv({
  server: {
    TURSO_DATABASE_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

