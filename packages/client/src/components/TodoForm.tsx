import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Calendar, Users, Tag, AlertCircle } from 'lucide-react';
import { Todo, Category, User } from '../types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the validation schema with Zod
const todoFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  categoryId: z.number().optional(),
  dueDate: z.string().optional(),
  assignedUserIds: z.array(z.number()).min(1, 'At least one user must be assigned')
});

type TodoFormSchema = z.infer<typeof todoFormSchema>;

interface TodoFormProps {
  initialData?: Partial<Todo>;
  onSubmit: (todo: Partial<Todo>) => Promise<void>;
  categories: Category[];
  users: User[];
  isLoading?: boolean;
  isSubmitting?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  initialData = {},
  onSubmit,
  categories = [],
  users = [],
  isLoading = false,
  isSubmitting = false,
}) => {
  const navigate = useNavigate();
  
  // React Hook Form setup with Zod validation
  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors, isDirty },
    watch,
    setValue
  } = useForm<TodoFormSchema>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || '',
      completed: initialData.completed || false,
      categoryId: initialData.categoryId,
      dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : undefined,
      assignedUserIds: initialData.assignedUserIds || []
    }
  });

  // Handle user assignment changes
  const handleUserChange = (userId: number) => {
    const currentAssignedUsers = watch('assignedUserIds') || [];
    const updatedAssignedUsers = currentAssignedUsers.includes(userId)
      ? currentAssignedUsers.filter(id => id !== userId)
      : [...currentAssignedUsers, userId];
    
    setValue('assignedUserIds', updatedAssignedUsers);
  };

  // Form submission handler
  const onFormSubmit = async (data: TodoFormSchema) => {
    try {
      await onSubmit(data);
      navigate('/');
    } catch (error) {
      console.error('Error submitting todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="form-group">
        <label htmlFor="title" className="form-label flex gap-1 items-center">
          <span>Title</span>
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          {...register('title')}
          className={`input ${
            errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
          }`}
          placeholder="What needs to be done?"
          disabled={isLoading || isSubmitting}
        />
        {errors.title && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="input"
          placeholder="Add some details about this task..."
          disabled={isLoading || isSubmitting}
        />
      </div>

      {/* Category */}
      <div className="form-group">
        <label htmlFor="categoryId" className="form-label flex items-center gap-1">
          <Tag size={16} />
          <span>Category</span>
        </label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <select
              id="categoryId"
              {...field}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              className="input"
              disabled={isLoading || isSubmitting}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      {/* Due Date */}
      <div className="form-group">
        <label htmlFor="dueDate" className="form-label flex items-center gap-1">
          <Calendar size={16} />
          <span>Due Date</span>
        </label>
        <input
          type="date"
          id="dueDate"
          {...register('dueDate')}
          className="input"
          disabled={isLoading || isSubmitting}
        />
      </div>

      {/* Assigned Users */}
      <div className="form-group">
        <label className="form-label flex items-center gap-1">
          <Users size={16} />
          <span>Assign Users</span>
          <span className="text-red-500">*</span>
        </label>
        
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {users.map(user => {
            const isChecked = (watch('assignedUserIds') || []).includes(user.id);
            return (
              <div 
                key={user.id} 
                className={`
                  flex items-center p-2 rounded-md border transition-colors cursor-pointer
                  ${isChecked 
                    ? 'bg-indigo-50 border-indigo-200' 
                    : 'hover:bg-gray-50 border-gray-200'
                  }
                `}
                onClick={() => handleUserChange(user.id)}
              >
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={isChecked}
                  onChange={() => {}} // Handled by parent div click
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={isLoading || isSubmitting}
                />
                <label 
                  htmlFor={`user-${user.id}`} 
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  {user.name}
                </label>
              </div>
            );
          })}
        </div>
        
        {errors.assignedUserIds && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.assignedUserIds.message}
          </p>
        )}
      </div>

      {/* Completed Status */}
      <div className="form-group flex items-center">
        <input
          type="checkbox"
          id="completed"
          {...register('completed')}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          disabled={isLoading || isSubmitting}
        />
        <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
          Mark as completed
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/')}
          disabled={isLoading || isSubmitting}
        >
          <X size={18} />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || isSubmitting || !isDirty}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save
            </>
          )}
        </button>
      </div>
    </form>
  );
};