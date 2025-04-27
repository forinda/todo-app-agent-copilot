import { AnyColumn, relations } from 'drizzle-orm';
import { pgTable, serial, text, json, boolean, integer, timestamp, PgColumn } from 'drizzle-orm/pg-core';
import { FK_USER_CONSTRAINTS } from './conf';
import { TaskUsers } from './task-users';

// ========== Tables ==========

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'),
  password: text('password'),
  roles: json('roles').$type<string[]>().default(['user']),
  is_active: boolean('is_active').default(true).notNull(),
  deactivated_by: integer('deactivated_by').references((): PgColumn => Users.id, FK_USER_CONSTRAINTS),
  deactivated_at: timestamp('deactivated_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// User relations
export const usersRelations = relations(Users, ({ many, one }) => ({
  tasks: many(TaskUsers),
 
}));
