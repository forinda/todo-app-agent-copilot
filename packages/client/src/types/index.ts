// Type definitions for the Todo App

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  meta?: {
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    [key: string]: any;
  };
  error?: {
    code?: string;
    details?: any;
    type?: string;
  };
}

// API Error type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Todo types
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  categoryId?: number;
  category?: Category;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  assignedUserIds?: number[];
}

export interface TodoFormData {
  title: string;
  description?: string;
  completed?: boolean;
  categoryId?: number;
  dueDate?: string;
  assignedUserIds?: number[];
}

// Category types
export interface Category {
  id: number;
  name: string;
  color: string;
  createdAt?: string;
  updatedAt?: string;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Pagination types
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and sort types
export interface TodoFilterOptions {
  search?: string;
  categoryId?: number;
  completed?: boolean;
  createdBy?: number;
  assignedTo?: number;
  dueDate?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}