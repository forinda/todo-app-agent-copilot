import { AxiosError } from 'axios';
import { ApiResponse, Category } from '../../types';
import { httpClient } from './httpClient';
import { handleResponse, handleError } from './responseHandler';

/**
 * Category API service
 */
export const categoryApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await httpClient.get<ApiResponse<Category[]>>('/categories');
      return handleResponse<Category[]>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Get a category by ID
   */
  getById: async (id: number): Promise<Category> => {
    try {
      const response = await httpClient.get<ApiResponse<Category>>(`/categories/${id}`);
      return handleResponse<Category>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Create a new category
   */
  create: async (categoryData: { name: string; color?: string }): Promise<Category> => {
    try {
      const response = await httpClient.post<ApiResponse<Category>>('/categories', categoryData);
      return handleResponse<Category>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Update an existing category
   */
  update: async (id: number, categoryData: Partial<{ name: string; color: string }>): Promise<Category> => {
    try {
      const response = await httpClient.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
      return handleResponse<Category>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Delete a category
   */
  delete: async (id: number): Promise<void> => {
    try {
      const response = await httpClient.delete<ApiResponse<void>>(`/categories/${id}`);
      return handleResponse<void>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
};