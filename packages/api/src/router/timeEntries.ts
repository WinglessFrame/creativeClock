import { z } from "zod";

import { and, eq, gte, lte, schema } from "@acme/db";

import { protectedProcedure } from "../trpc";

export const timeEntriesRouter = {
  getUserTimeEntries: protectedProcedure
    .input(
      z.object({ from: z.date(), to: z.date() }).refine(({ to, from }) => {
        return to > from;
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(schema.timeEntries)
        .where(
          and(
            eq(schema.timeEntries.userId, ctx.session.user.id),
            gte(schema.timeEntries.date, input.from),
            lte(schema.timeEntries.date, input.to),
          ),
        )
        .all();
    }),
  createTimeEntry: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        notes: z.string(),
        projectCategoryId: z.string(),
        timeInMinutes: z.number().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(schema.timeEntries).values([
        {
          ...input,
          userId: ctx.session.user.id,
        },
      ]);
    }),

  deleteTimeEntry: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(schema.timeEntries)
        .where(eq(schema.timeEntries.id, input))
        .returning();
    }),
};
