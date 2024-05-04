import { int, text, } from "drizzle-orm/sqlite-core";
import { sqlLiteTable } from "./_table";
import { users } from "./auth";
import { relations } from "drizzle-orm";
import { usersToProjects, userToProjectsRelations } from "./permission";

export const projects = sqlLiteTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
})

export const projectRelations = relations(projects, ({ many }) => ({
  assignedUsers: many(usersToProjects),
  categories: many(projectCategory)
}))

export const projectCategory = sqlLiteTable("projectCategory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  projectId: text("projectId").notNull().references(() => projects.id, { onDelete: "cascade" })
})

export const projectCategoriesRelations = relations(projectCategory, ({ one }) => ({
  project: one(projects, {
    fields: [projectCategory.projectId],
    references: [projects.id]
  })
}))

export const timeEntries = sqlLiteTable("timeEntry", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  notes: text("notes"),
  timeInMinutes: int("timeInMinutes").notNull(),
  date: int("date", { mode: 'timestamp', }).notNull(),
  projectCategoryId: text("projectCategoryId").notNull().references(() => projectCategory.id, { onDelete: "cascade" })
})

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  projectCategory: one(projectCategory, {
    fields: [timeEntries.projectCategoryId],
    references: [projectCategory.id]
  }),
  creator: one(users, {
    fields: [timeEntries.userId],
    references: [users.id],
    relationName: 'creator',
  })
}))