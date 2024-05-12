import { authRouter } from "./router/auth";
import { expensesRouter } from "./router/expenses";
import { timeEntriesRouter } from "./router/timeEntries";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  timeEntries: timeEntriesRouter,
  expenses: expensesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
