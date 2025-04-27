import { AxiosError } from 'axios';
import { ApiResponse, User } from '../../types';
import { httpClient } from './httpClient';
import { handleResponse, handleError } from './responseHandler';

/**
 * Authentication API service
 */
export const authApi = {
  /**
   * User login
   */
  login: async (credentials: { email: string; password: string }): Promise<any> => {
    try {
      const response = await httpClient.post<ApiResponse<any>>('auth/login', credentials);
      return handleResponse<any>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * User registration
   */
  register: async (userData: { name: string; email: string; password: string }): Promise<User> => {
    try {
      const response = await httpClient.post<ApiResponse<User>>('auth/register', userData);
      return handleResponse<User>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * User logout
   */
  logout: async (): Promise<void> => {
    try {
      const response = await httpClient.post<ApiResponse<void>>('auth/logout');
      return handleResponse<void>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Get current logged-in user
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await httpClient.get<ApiResponse<User>>('auth/me');
      return handleResponse<User>(response);
    } catch (error) {
      // Don't throw for auth checks that fail
      if ((error as AxiosError).response?.status === 401) {
        return null;
      }
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
};