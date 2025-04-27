import { pgTable, integer, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { FK_CASCADE_CONSTRAINTS, FK_USER_CONSTRAINTS } from './conf';
import { Tasks } from './tasks';
import { Users } from './users';
import { relations } from 'drizzle-orm';


export const TaskUsers = pgTable('todo_users', {
  task_id: integer('task_id').notNull().references(() => Tasks.id, FK_CASCADE_CONSTRAINTS),
  user_id: integer('user_id').notNull().references(() => Users.id, FK_CASCADE_CONSTRAINTS),
  role: text('role').default('assignee').notNull(), // 'assignee', 'reviewer', etc.
  created_by: integer('created_by').notNull().references(() => Users.id, FK_USER_CONSTRAINTS),
  updated_by: integer('updated_by').notNull().references(() => Users.id, FK_USER_CONSTRAINTS),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (t) => (
  [primaryKey({ columns: [t.task_id, t.user_id] }),
  ]));
// TaskUsers relations
export const taskUsersRelations = relations(TaskUsers, ({ one }) => ({
  task: one(Tasks, {
    fields: [TaskUsers.task_id],
    references: [Tasks.id],
  }),
  user: one(Users, {
    fields: [TaskUsers.user_id],
    references: [Users.id],
  }),
  createdByUser: one(Users, {
    fields: [TaskUsers.created_by],
    references: [Users.id],
  }),
  updatedByUser: one(Users, {
    fields: [TaskUsers.updated_by],
    references: [Users.id],
  }),
}));