import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { dbEnv } from "./dbEnv";
import * as auth from "./schema/auth";
import * as post from "./schema/post";

export * from "drizzle-orm/sql";

export const schema = { ...auth, ...post };

const turso = createClient({
  url: dbEnv.TURSO_DATABASE_URL!,
  authToken: dbEnv.TURSO_AUTH_TOKEN,
});


export const db = drizzle(turso);
