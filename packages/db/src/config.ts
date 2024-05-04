import type { Config } from 'drizzle-kit';
import { dbEnv } from './env';

export default {
  schema: './src/schema',
  driver: 'turso',
  dbCredentials: {
    url: dbEnv.TURSO_DATABASE_URL,
    authToken: dbEnv.TURSO_AUTH_TOKEN,
  },
} satisfies Config;