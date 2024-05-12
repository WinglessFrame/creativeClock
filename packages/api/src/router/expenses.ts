import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, schema } from "@acme/db";

import { protectedProcedure } from "../trpc";

export const expensesRouter = {
  getUserExpenses: protectedProcedure
    .input(z.undefined())
    .query(async ({ ctx }) =>
      ctx.db.query.expenses.findMany({
        where: eq(schema.expenses.userId, ctx.session.user.id),
        with: {
          projectExpenseCategory: {
            with: {
              project: true,
            },
          },
        },
      }),
    ),
  createExpense: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        notes: z.string().optional(),
        projectExpenseCategoryId: z.string(),
        receipt: z.string().optional(),
        amount: z.number().min(1),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.insert(schema.expenses).values([
        {
          ...input,
          isApproved: false,
          userId: ctx.session.user.id,
        },
      ]),
    ),
  updateExpense: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        notes: z.string().optional(),
        projectCategoryId: z.string(),
        timeInMinutes: z.number().min(1),
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(schema.expenses)
        .set(input)
        .where(eq(schema.expenses.id, input.id)),
    ),
  deleteExpense: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.delete(schema.expenses).where(eq(schema.expenses.id, input.id)),
    ),
};
