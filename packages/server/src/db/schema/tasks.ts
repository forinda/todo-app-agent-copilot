import { pgTable, serial, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { FK_USER_CONSTRAINTS } from './conf';
import { relations } from 'drizzle-orm';
import { Users } from './users';
import { TaskCategory } from './categories';
import { TaskUsers } from './task-users';






export const Tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  due_date: timestamp('due_date'),
  priority: integer('priority').default(2), // 1=high, 2=medium, 3=low
  category_id: integer('category_id').references(() => TaskCategory.id, FK_USER_CONSTRAINTS),
  is_active: boolean('is_active').default(true).notNull(),
  created_by: integer('created_by').notNull().references(() => Users.id, FK_USER_CONSTRAINTS),
  updated_by: integer('updated_by').notNull().references(() => Users.id, FK_USER_CONSTRAINTS),
  deleted_by: integer('deleted_by').references(() => Users.id, FK_USER_CONSTRAINTS),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'),
}, );


// Task relations
export const tasksRelations = relations(Tasks, ({ one, many }) => ({
  category: one(TaskCategory, {
    fields: [Tasks.category_id],
    references: [TaskCategory.id],
  }),
  taskUsers: many(TaskUsers),
  createdByUser: one(Users, {
    fields: [Tasks.created_by],
    references: [Users.id],
  }),
  updatedByUser: one(Users, {
    fields: [Tasks.updated_by],
    references: [Users.id],
  }),
  deletedByUser: one(Users, {
    fields: [Tasks.deleted_by],
    references: [Users.id],
  }),
}));

