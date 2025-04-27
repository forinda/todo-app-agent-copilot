import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Loader } from 'lucide-react';
import { TodoForm } from '../components/TodoForm';
import { useTodos } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import { useUsers } from '../hooks/useUsers';
import { TodoFormData } from '../types';

const CreateTodoPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTodo } = useTodos();
  const { categories } = useCategories();
  const { users } = useUsers();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (todoData: TodoFormData) => {
    setSubmitting(true);
    setError(null);
    
    try {
      await addTodo(todoData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Link 
          to="/"
          className="mr-4 p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Create New Task</h1>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md animate-fade-in flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <div className="card p-6">
        <TodoForm 
          onSubmit={handleSubmit}
          categories={categories}
          users={users}
          isSubmitting={submitting}
        />
      </div>
    </div>
  );
};

export default CreateTodoPage;