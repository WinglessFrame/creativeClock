import { relations } from "drizzle-orm";
import { int, text } from "drizzle-orm/sqlite-core";

import { sqlLiteTable } from "./_table";
import { users } from "./auth";
import { projects } from "./timeEntry";

export const projectExpenseCategory = sqlLiteTable("projectExpenseCategory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  projectId: text("projectId")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
});

export const projectExpenseCategoriesRelations = relations(
  projectExpenseCategory,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectExpenseCategory.projectId],
      references: [projects.id],
    }),
  }),
);

export const expenses = sqlLiteTable("expenses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  notes: text("notes"),
  receipt: text("receipt"),
  isApproved: int("isApproved", { mode: "boolean" }).notNull(),
  amount: int("amount").notNull(),
  date: int("date", { mode: "timestamp" }).notNull(),
  projectExpenseCategoryId: text("projectExpenseCategoryId")
    .notNull()
    .references(() => projectExpenseCategory.id, { onDelete: "cascade" }),
});

export const expsensesRelations = relations(expenses, ({ one }) => ({
  projectExpenseCategory: one(projectExpenseCategory, {
    fields: [expenses.projectExpenseCategoryId],
    references: [projectExpenseCategory.id],
  }),
  creator: one(users, {
    fields: [expenses.userId],
    references: [users.id],
    relationName: "creator",
  }),
}));
