import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { dbEnv } from "./env";
import * as auth from "./schema/auth";

export * from "drizzle-orm/sql";

export const schema = { ...auth, };

const turso = createClient({
  url: dbEnv.TURSO_DATABASE_URL!,
  authToken: dbEnv.TURSO_AUTH_TOKEN,
});


export const db = drizzle(turso);
