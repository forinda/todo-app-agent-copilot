import { AxiosError } from 'axios';
import { ApiResponse, Todo, TodoFormData, PaginationOptions, TodoFilterOptions, SortOptions } from '../../types';
import { httpClient } from './httpClient';
import { handleResponse, handleError, buildQueryParams, extractMeta } from './responseHandler';

/**
 * Todo API service
 */
export const todoApi = {
  /**
   * Get all todos with pagination, filters, and sorting
   */
  getAll: async (
    pagination: PaginationOptions = { page: 1, limit: 10 },
    filters: TodoFilterOptions = {},
    sort: SortOptions = { field: 'createdAt', direction: 'desc' }
  ): Promise<{ todos: Todo[], total: number }> => {
    try {
      const params = buildQueryParams({
        ...pagination,
        ...filters,
        sortField: sort.field,
        sortDirection: sort.direction
      });
      
      const response = await httpClient.get<ApiResponse<Todo[]>>('/todos', { params });
      const todos = handleResponse<Todo[]>(response);
      const meta = extractMeta(response);
      
      return { 
        todos,
        total: meta?.pagination?.total || todos.length
      };
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Get a todo by ID
   */
  getById: async (id: number): Promise<Todo> => {
    try {
      const response = await httpClient.get<ApiResponse<Todo>>(`/todos/${id}`);
      return handleResponse<Todo>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Create a new todo
   */
  create: async (todoData: TodoFormData): Promise<Todo> => {
    try {
      const response = await httpClient.post<ApiResponse<Todo>>('/todos', todoData);
      return handleResponse<Todo>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Update an existing todo
   */
  update: async (id: number, todoData: Partial<TodoFormData>): Promise<Todo> => {
    try {
      const response = await httpClient.put<ApiResponse<Todo>>(`/todos/${id}`, todoData);
      return handleResponse<Todo>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Delete a todo
   */
  delete: async (id: number): Promise<void> => {
    try {
      const response = await httpClient.delete<ApiResponse<void>>(`/todos/${id}`);
      return handleResponse<void>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Mark a todo as completed
   */
  complete: async (id: number): Promise<Todo> => {
    try {
      const response = await httpClient.put<ApiResponse<Todo>>(`/todos/${id}/complete`);
      return handleResponse<Todo>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Bulk delete todos
   */
  bulkDelete: async (ids: number[]): Promise<void> => {
    try {
      const response = await httpClient.post<ApiResponse<void>>('/todos/bulk-delete', { ids });
      return handleResponse<void>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Bulk complete todos
   */
  bulkComplete: async (ids: number[]): Promise<void> => {
    try {
      const response = await httpClient.post<ApiResponse<void>>('/todos/bulk-complete', { ids });
      return handleResponse<void>(response);
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Get todos by category ID
   */
  getByCategory: async (categoryId: number, pagination?: PaginationOptions): Promise<{ todos: Todo[], total: number }> => {
    try {
      const params = pagination ? buildQueryParams(pagination) : {};
      const response = await httpClient.get<ApiResponse<Todo[]>>(`/todos/category/${categoryId}`, { params });
      const todos = handleResponse<Todo[]>(response);
      const meta = extractMeta(response);
      
      return { 
        todos,
        total: meta?.pagination?.total || todos.length
      };
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
  
  /**
   * Get todos by user ID
   */
  getByUser: async (userId: number, pagination?: PaginationOptions): Promise<{ todos: Todo[], total: number }> => {
    try {
      const params = pagination ? buildQueryParams(pagination) : {};
      const response = await httpClient.get<ApiResponse<Todo[]>>(`/todos/user/${userId}`, { params });
      const todos = handleResponse<Todo[]>(response);
      const meta = extractMeta(response);
      
      return { 
        todos,
        total: meta?.pagination?.total || todos.length
      };
    } catch (error) {
      return handleError(error as AxiosError<ApiResponse>);
    }
  },
};