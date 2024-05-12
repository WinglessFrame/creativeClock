import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { dbEnv } from "./env";
import * as auth from "./schema/auth";
import * as expenses from "./schema/expsense";
import * as permissions from "./schema/permission";
import * as timeEntry from "./schema/timeEntry";

export * from "drizzle-orm/sql";
export { getTableColumns } from "drizzle-orm";

export const schema = {
  ...auth,
  ...timeEntry,
  ...expenses,
  ...permissions,
};

const turso = createClient({
  url: dbEnv.TURSO_DATABASE_URL,
  authToken: dbEnv.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso, { schema });
