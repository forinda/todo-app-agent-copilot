import { AxiosError } from 'axios';
import { ApiResponse, User } from '../../types';
import { httpClient } from './httpClient';
import { handleResponse, handleError } from './responseHandler';

/**
 * User API service
 */
export const userApi = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    try {
      const response = await httpClient.get<ApiResponse<User[]>>('/users');
      return handleResponse<User[]>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Get a user by ID
   */
  getById: async (id: number): Promise<User> => {
    try {
      const response = await httpClient.get<ApiResponse<User>>(`/users/${id}`);
      return handleResponse<User>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Create a new user
   */
  create: async (userData: { name: string; email: string; avatar?: string }): Promise<User> => {
    try {
      const response = await httpClient.post<ApiResponse<User>>('/users', userData);
      return handleResponse<User>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Update an existing user
   */
  update: async (id: number, userData: Partial<{ name: string; email: string; avatar: string }>): Promise<User> => {
    try {
      const response = await httpClient.put<ApiResponse<User>>(`/users/${id}`, userData);
      return handleResponse<User>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Delete a user
   */
  delete: async (id: number): Promise<void> => {
    try {
      const response = await httpClient.delete<ApiResponse<void>>(`/users/${id}`);
      return handleResponse<void>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
};