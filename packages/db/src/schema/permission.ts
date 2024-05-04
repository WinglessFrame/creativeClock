import { text } from 'drizzle-orm/sqlite-core'
import { sqlLiteTable } from './_table'
import { users } from './auth'
import { projects } from './timeEntry'
import { relations } from 'drizzle-orm'

export const usersToProjects = sqlLiteTable('userToProjects', {
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: text('projectId').notNull().references(() => projects.id, { onDelete: 'cascade' }),
})

export const userToProjectsRelations = relations(usersToProjects, ({ one }) => ({
  user: one(users, {
    fields: [usersToProjects.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [usersToProjects.projectId],
    references: [projects.id],
  }),
}))

const permissionEnum = ["ProjectAdmin"] as const
export const permissions = sqlLiteTable('permissions', {
  name: text('name', { enum: permissionEnum }).notNull().unique(),
})