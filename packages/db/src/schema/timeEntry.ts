import { int, text, } from "drizzle-orm/sqlite-core";
import { sqlLiteTable } from "./_table";
import { users } from "./auth";

export const projects = sqlLiteTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
})

export const projectCategory = sqlLiteTable("projectCategory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  projectId: text("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
})

export const timeEntries = sqlLiteTable("timeEntry", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  notes: text("notes"),
  timeInMinutes: int("timeInMinutes").notNull(),
  date: int("date", { mode: 'timestamp', }).notNull(),
  projectCategoryId: text("projectCategoryId").notNull().references(() => projectCategory.id, { onDelete: "cascade" }),
})