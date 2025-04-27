import { pgTable, serial, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { FK_USER_CONSTRAINTS } from './conf';
import { Users } from './users';
import { relations } from 'drizzle-orm';
import { Tasks } from './tasks';





export const TaskCategory = pgTable('task_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').default('#3498db').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_by: integer('created_by').notNull().references(() => Users.id, FK_USER_CONSTRAINTS),
  updated_by: integer('updated_by').notNull().references(() => Users.id, FK_USER_CONSTRAINTS),
  deleted_by: integer('deleted_by').references(() => Users.id, FK_USER_CONSTRAINTS),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'),
});
// Category relations
export const taskCategoryRelations = relations(TaskCategory, ({ many, one }) => ({
  todos: many(Tasks),
  createdByUser: one(Users, {
    fields: [TaskCategory.created_by],
    references: [Users.id],
  }),
  updatedByUser: one(Users, {
    fields: [TaskCategory.updated_by],
    references: [Users.id],
  }),
  deletedByUser: one(Users, {
    fields: [TaskCategory.deleted_by],
    references: [Users.id],
  }),
}));