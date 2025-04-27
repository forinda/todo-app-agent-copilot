import { z } from 'zod';

// Base Task schema
export const taskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional().nullable(),
  completed: z.boolean().default(false),
  categoryId: z.number().int().positive().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Task validation schemas
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    completed: z.boolean().optional().default(false),
    categoryId: z.number().int().positive().optional(),
    dueDate: z.string().datetime().optional(), // ISO date string
    assignedUserIds: z.array(z.number().int().positive()).min(1, "At least one user must be assigned").optional(),
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters").optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
    categoryId: z.number().int().positive().optional(),
    dueDate: z.string().datetime().optional().nullable(),
    assignedUserIds: z.array(z.number().int().positive()).optional(),
  })
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  })
});

export const taskFilterSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    categoryId: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    completed: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
    search: z.string().optional(),
    sortField: z.string().optional().default('createdAt'),
    sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
  })
});

export const bulkActionSchema = z.object({
  body: z.object({
    ids: z.array(z.number().int().positive())
      .min(1, "At least one task ID must be provided")
  })
});

// Task interfaces
export interface ITaskModel {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  categoryId?: number | null;
  dueDate?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  assignedUsers?: { id: number; name: string; email: string; avatar?: string }[];
  category?: { id: number; name: string; color: string };
}

export interface ITaskDTO {
  title: string;
  description?: string;
  completed?: boolean;
  categoryId?: number | null;
  dueDate?: Date | string | null;
  assignedUserIds?: number[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface FilterOptions {
  categoryId?: number;
  completed?: boolean;
  search?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TasksOptions {
  page: number;
  limit: number;
  filter?: FilterOptions;
  sort?: SortOptions;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}