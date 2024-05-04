import { text } from 'drizzle-orm/sqlite-core'
import { sqlLiteTable } from './_table'
import { users } from './auth'
import { projects } from './timeEntry'

export const userToProjects = sqlLiteTable('userToProjects', {
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: text('projectId').notNull().references(() => projects.id, { onDelete: 'cascade' }),
})

const permissionEnum = ["ProjectAdmin"] as const
export const permissions = sqlLiteTable('permissions', {
  name: text('name', { enum: permissionEnum }).notNull().unique(),
})