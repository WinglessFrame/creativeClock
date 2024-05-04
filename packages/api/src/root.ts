import { authRouter } from "./router/auth";
import { createTRPCRouter } from "./trpc";
import { timeEntriesRouter } from './router/timeEntries'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  timeEntries: timeEntriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
