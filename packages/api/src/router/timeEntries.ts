import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, eq, gte, lte, schema } from "@acme/db";

import { protectedProcedure } from "../trpc";

const timeBoundariesSchema = z
  .object({ from: z.date(), to: z.date() })
  .refine(({ to, from }) => {
    return to > from;
  });
export type TimeBoundaries = z.infer<typeof timeBoundariesSchema>;

export const timeEntriesRouter = {
  getUserCategories: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.usersToProjects.findMany({
      with: {
        project: {
          with: {
            categories: true,
          },
        },
      },
      where: eq(schema.usersToProjects.userId, ctx.session.user.id),
    });

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return result.map((userToProject) => userToProject.project);
  }),
  getUserTimeEntries: protectedProcedure
    .input(timeBoundariesSchema)
    .query(async ({ ctx, input }) =>
      ctx.db.query.timeEntries.findMany({
        where: and(
          eq(schema.timeEntries.userId, ctx.session.user.id),
          gte(schema.timeEntries.date, input.from),
          lte(schema.timeEntries.date, input.to),
        ),
        with: {
          projectCategory: {
            with: {
              project: true,
            },
          },
        },
      }),
    ),
  createTimeEntry: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        notes: z.string().optional(),
        projectCategoryId: z.string(),
        timeInMinutes: z.number().min(1),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.insert(schema.timeEntries).values([
        {
          ...input,
          userId: ctx.session.user.id,
        },
      ]),
    ),

  updateTimeEntry: protectedProcedure
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
        .update(schema.timeEntries)
        .set(input)
        .where(eq(schema.timeEntries.id, input.id)),
    ),

  deleteTimeEntry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .delete(schema.timeEntries)
        .where(eq(schema.timeEntries.id, input.id)),
    ),
};
