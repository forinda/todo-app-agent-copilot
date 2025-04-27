import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/api';
import { User, ApiError } from '../types';
import { toastService } from '../utils/toastService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error 
        ? { message: err.message } 
        : err as ApiError
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Add new user
  const addUser = async (userData: { name: string; email: string; avatar?: string }): Promise<User> => {
    try {
      return await toastService.promise(
        userApi.create(userData),
        {
          loading: 'Creating user...',
          success: 'User created successfully!',
          error: 'Failed to create user'
        }
      );
    } catch (err) {
      // Error is already handled by the toast service
      throw err;
    } finally {
      await fetchUsers(); // Refresh users
    }
  };

  // Update existing user
  const updateUser = async (id: number, userData: Partial<{ name: string; email: string; avatar: string }>): Promise<User> => {
    try {
      return await toastService.promise(
        userApi.update(id, userData),
        {
          loading: 'Updating user...',
          success: 'User updated successfully!',
          error: 'Failed to update user'
        }
      );
    } catch (err) {
      // Error is already handled by the toast service
      throw err;
    } finally {
      await fetchUsers(); // Refresh users
    }
  };

  // Delete user
  const deleteUser = async (id: number): Promise<void> => {
    try {
      await toastService.promise(
        userApi.delete(id),
        {
          loading: 'Deleting user...',
          success: 'User deleted successfully!',
          error: 'Failed to delete user'
        }
      );
    } catch (err) {
      // Error is already handled by the toast service
      throw err;
    } finally {
      await fetchUsers(); // Refresh users
    }
  };

  // Get user by ID
  const getUserById = (id?: number): User | undefined => {
    if (!id) return undefined;
    return users.find(user => user.id === id);
  };

  // Get users by IDs
  const getUsersByIds = (ids?: number[]): User[] => {
    if (!ids || ids.length === 0) return [];
    return users.filter(user => ids.includes(user.id));
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByIds,
  };
};