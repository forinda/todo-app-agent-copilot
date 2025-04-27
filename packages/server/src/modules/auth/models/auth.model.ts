import { z } from 'zod';
import { Role } from './permissions';

// Auth validation schemas
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  })
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    avatar: z.string().url("Invalid URL for avatar").optional(),
    roles: z.array(z.nativeEnum(Role)).optional().default([Role.USER]),
  })
});

// Auth interfaces
export interface ILoginDTO {
  email: string;
  password: string;
}

export interface IRegisterDTO {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  roles?: Role[];
}

export interface IAuthPayload {
  userId: number;
  email: string;
  roles: Role[];
}

export interface ITokenResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    roles: Role[];
  };
}