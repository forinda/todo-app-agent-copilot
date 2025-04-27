
// ========== Configuration ==========
// export type AuditMode = 'create' | 'approve' | 'delete' | 'update' | 'activate';

export const FK_USER_CONSTRAINTS = { onDelete: 'restrict', onUpdate: 'cascade' } as const;
export const FK_CASCADE_CONSTRAINTS = { onDelete: 'cascade', onUpdate: 'cascade' } as const;

// export const createAuditFields = (mode: AuditMode) => {
//   switch (mode) {
//     case 'create':
//       return {
//         created_by: integer('created_by').notNull().references(() => users.id, FK_USER_CONSTRAINTS),
//         created_at: timestamp('created_at').defaultNow().notNull(),
//       }

//     case 'update':
//       return {
//         updated_by: integer('updated_by').notNull().references(() => users.id, FK_USER_CONSTRAINTS),
//         updated_at: timestamp('updated_at').defaultNow().notNull(),
//       }
//     case 'delete':
//       return {
//         deleted_by: integer('deleted_by').references(() => users.id, FK_USER_CONSTRAINTS),
//         deleted_at: timestamp('deleted_at'),
//       }
//     case 'approve':
//       return {
//         approved_by: integer('approved_by').references(() => users.id, FK_USER_CONSTRAINTS),
//         approved_at: timestamp('approved_at').defaultNow().notNull(),
//       }
//     case 'activate':
//       return {
//         activated_by: integer('activated_by').references(() => users.id, FK_USER_CONSTRAINTS),
//         activated_at: timestamp('activated_at').defaultNow().notNull(),
//       }
//     default:
//       return {};
//   }
// };