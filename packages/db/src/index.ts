import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { dbEnv } from "./env";
import * as auth from "./schema/auth";
import * as timeEntry from "./schema/timeEntry";
import * as permissions from "./schema/permission";

export * from "drizzle-orm/sql";

export const schema = {
  ...auth,
  ...timeEntry,
  ...permissions,
};

const turso = createClient({
  url: dbEnv.TURSO_DATABASE_URL,
  authToken: dbEnv.TURSO_AUTH_TOKEN,
});


export const db = drizzle(turso);
