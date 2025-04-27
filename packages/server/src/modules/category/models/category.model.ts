import { z } from 'zod';

// Base Category schema
export const categorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Category name is required").max(50, "Name must be less than 50 characters"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format").default('#3498db'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Category validation schemas
export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required").max(50, "Name must be less than 50 characters"),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format").optional().default('#3498db'),
  })
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  }),
  body: z.object({
    name: z.string().min(1, "Category name is required").max(50, "Name must be less than 50 characters").optional(),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format").optional(),
  })
});

export const getCategorySchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  })
});

// Category interfaces
export interface ICategoryModel {
  id: number;
  name: string;
  color: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ICategoryDTO {
  name: string;
  color?: string;
}