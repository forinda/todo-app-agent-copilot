import { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '../services/api';
import { Category, ApiError } from '../types';
import { toastService } from '../utils/toastService';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
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
    fetchCategories();
  }, [fetchCategories]);

  // Add new category
  const addCategory = async (categoryData: { name: string; color?: string }): Promise<Category> => {
    try {
      return await toastService.promise(
        categoryApi.create(categoryData),
        {
          loading: 'Creating category...',
          success: 'Category created successfully!',
          error: 'Failed to create category'
        }
      );
    } catch (err) {
      // Error is already handled by the toast service
      throw err;
    } finally {
      await fetchCategories(); // Refresh categories
    }
  };

  // Update existing category
  const updateCategory = async (id: number, categoryData: Partial<{ name: string; color: string }>): Promise<Category> => {
    try {
      return await toastService.promise(
        categoryApi.update(id, categoryData),
        {
          loading: 'Updating category...',
          success: 'Category updated successfully!',
          error: 'Failed to update category'
        }
      );
    } catch (err) {
      // Error is already handled by the toast service
      throw err;
    } finally {
      await fetchCategories(); // Refresh categories
    }
  };

  // Delete category
  const deleteCategory = async (id: number): Promise<void> => {
    try {
      await toastService.promise(
        categoryApi.delete(id),
        {
          loading: 'Deleting category...',
          success: 'Category deleted successfully!',
          error: 'Failed to delete category'
        }
      );
    } catch (err) {
      // Error is already handled by the toast service
      throw err;
    } finally {
      await fetchCategories(); // Refresh categories
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};