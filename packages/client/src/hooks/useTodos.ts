import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { todoApi } from '../services/api';
import { Todo, TodoFormData, ApiError, PaginationOptions, TodoFilterOptions, SortOptions } from '../types';
import { toastService } from '../utils/toastService';

// Hook for fetching todos with pagination and filters
export const useTodos = (
  pagination: PaginationOptions = { page: 1, limit: 10 },
  filters: TodoFilterOptions = {},
  sort: SortOptions = { field: 'createdAt', direction: 'desc' }
): UseQueryResult<{ todos: Todo[], total: number }, ApiError> => {
  return useQuery({
    queryKey: ['todos', pagination, filters, sort],
    queryFn: async () => {
      const data = await todoApi.getAll(pagination, filters, sort);
      return data;
    },
  });
};

// Hook for fetching a single todo by ID
export const useTodo = (id?: number): UseQueryResult<Todo, ApiError> => {
  return useQuery({
    queryKey: ['todos', id],
    queryFn: async () => {
      if (!id) throw new Error('Todo ID is required');
      return await todoApi.getById(id);
    },
    enabled: !!id, // Only run the query if we have an ID
  });
};

// Hook for creating a new todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (todoData: TodoFormData) => {
      return toastService.promise(
        todoApi.create(todoData),
        {
          loading: 'Creating task...',
          success: 'Task created successfully!',
          error: 'Failed to create task'
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

// Hook for updating a todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<TodoFormData> }) => {
      return toastService.promise(
        todoApi.update(id, data),
        {
          loading: 'Updating task...',
          success: 'Task updated successfully!',
          error: 'Failed to update task'
        }
      );
    },
    onSuccess: (updatedTodo, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', id] });
    },
  });
};

// Hook for deleting a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => {
      return toastService.promise(
        todoApi.delete(id),
        {
          loading: 'Deleting task...',
          success: 'Task deleted successfully!',
          error: 'Failed to delete task'
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

// Hook for completing a todo
export const useCompleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => {
      return toastService.promise(
        todoApi.complete(id),
        {
          loading: 'Updating task status...',
          success: 'Task marked as completed!',
          error: 'Failed to update task status'
        }
      );
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todos', id] });
    },
  });
};

// Hook for bulk actions on todos with pagination state management
export const useBulkTodoActions = () => {
  const queryClient = useQueryClient();
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);
  
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => {
      return toastService.promise(
        todoApi.bulkDelete(ids),
        {
          loading: `Deleting ${ids.length} tasks...`,
          success: `${ids.length} tasks deleted successfully!`,
          error: 'Failed to delete tasks'
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setSelectedTodos([]);
    },
  });
  
  const bulkCompleteMutation = useMutation({
    mutationFn: (ids: number[]) => {
      return toastService.promise(
        todoApi.bulkComplete(ids),
        {
          loading: `Completing ${ids.length} tasks...`,
          success: `${ids.length} tasks marked as completed!`,
          error: 'Failed to update tasks'
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setSelectedTodos([]);
    },
  });
  
  return {
    selectedTodos,
    setSelectedTodos,
    bulkDelete: bulkDeleteMutation.mutate,
    bulkComplete: bulkCompleteMutation.mutate,
    isLoading: bulkDeleteMutation.isPending || bulkCompleteMutation.isPending
  };
};