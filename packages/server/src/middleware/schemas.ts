import { z } from 'zod';
import { injectable } from 'inversify';
import { ValidationError } from '../utils/errors/base';

// Base schemas for query parameters
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    sortField: z.string().optional(),
    sortDirection: z.enum(['asc', 'desc']).optional().default('asc'),
  })
});

// Todo schemas
export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    completed: z.boolean().optional().default(false),
    categoryId: z.number().int().positive().optional(),
    dueDate: z.string().datetime().optional(), // ISO date string
    assignedUserIds: z.array(z.number().int().positive()).min(1, "At least one user must be assigned").optional(),
  })
});

export const updateTodoSchema = z.object({
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

export const getTodoSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  })
});

export const todoFilterSchema = z.object({
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
      .min(1, "At least one todo ID must be provided")
  })
});

// Category schemas
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required").max(50, "Name must be less than 50 characters"),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format, must be a valid hex color").optional().default('#3498db'),
  })
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  }),
  body: z.object({
    name: z.string().min(1, "Category name is required").max(50, "Name must be less than 50 characters").optional(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format, must be a valid hex color").optional(),
  })
});

export const getCategorySchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  })
});

// User schemas
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email address"),
    avatar: z.string().url("Invalid URL for avatar").optional(),
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  }),
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    avatar: z.string().url("Invalid URL for avatar").optional().nullable(),
  })
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  })
});

@injectable()
export class SchemaValidator {
  /**
   * Validates payload against a Zod schema and throws a consistent ValidationError on failure
   * @param schema Zod schema to validate against
   * @param payload Data to validate
   * @returns Validated data if successful
   * @throws {ValidationError} If validation fails
   */
  validate<T = any>(schema: z.Schema<T>, payload: any): T {
    const result = schema.safeParse(payload);

    if (!result.success) {
      const error = result.error;
      const firstIssue = error.issues[0];
      const path = firstIssue.path.join('.');
      
      const message = path 
        ? firstIssue.message.toLowerCase().includes(path.toLowerCase())
          ? firstIssue.message
          : `[${path}] ${firstIssue.message}`
        : firstIssue.message;

      throw new ValidationError(message, {
        code: 'VALIDATION_ERROR',
        details: error.issues.map(issue => ({
          path: issue.path,
          message: issue.message,
          code: issue.code
        })),
        field: path
      });
    }

    return result.data;
  }
}