import { z } from 'zod';

// Base User schema
export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  avatar: z.string().url("Invalid URL for avatar").optional().nullable(),
  roles: z.array(z.string()).default(['user']),
  password: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// User validation schemas
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    avatar: z.string().url("Invalid URL for avatar").optional(),
    roles: z.array(z.string()).optional().default(['user']),
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
    roles: z.array(z.string()).optional(),
    password: z.string().optional(),
  })
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val)),
  })
});

// User interfaces
export interface IUserModel {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  roles: string[] | null;
  password: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface IUserDTO {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  roles?: string[];
}