import { z } from "zod";

import { and, eq, gte, lte, schema, getTableColumns } from "@acme/db";

import { protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const timeEntriesRouter = {
  getUserCategories: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.users.findFirst({
      with: {
        userToProjects: {
          with: {
            project: {
              with: {
                categories: true
              }
            }
          }
        }
      },
      where: eq(schema.users.id, ctx.session.user.id)
    })

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    return result.userToProjects.map((userToProject) => userToProject.project);
  }),
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
        .leftJoin(schema.usersToProjects, eq(schema.timeEntries.projectCategoryId, schema.usersToProjects.projectId))
        .leftJoin(schema.usersToProjects, eq(schema.timeEntries.projectCategoryId, schema.usersToProjects.projectId))
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
