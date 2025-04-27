import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { TodoForm } from '../components/TodoForm';
import { useTodos } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import { useUsers } from '../hooks/useUsers';
import { Todo, TodoFormData } from '../types';
import { todoApi } from '../services/api';

const EditTodoPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const todoId = parseInt(id || '0');
  
  const { updateTodo } = useTodos();
  const { categories } = useCategories();
  const { users } = useUsers();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todo data
  useEffect(() => {
    const fetchTodo = async () => {
      if (!todoId) {
        setError('Invalid task ID');
        setLoading(false);
        return;
      }
      
      try {
        const data = await todoApi.getById(todoId);
        setTodo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodo();
  }, [todoId]);

  const handleSubmit = async (todoData: TodoFormData) => {
    if (!todoId) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      await updateTodo(todoId, todoData);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
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
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Task
        </h1>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-md animate-fade-in flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 text-red-500" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <div className="card p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Loading task details...</p>
          </div>
        ) : todo ? (
          <TodoForm 
            initialData={todo}
            onSubmit={handleSubmit}
            categories={categories}
            users={users}
            isSubmitting={submitting}
          />
        ) : (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Task not found</h2>
            <p className="text-gray-500 mb-6">The task you're looking for doesn't exist or has been deleted.</p>
            <Link to="/" className="btn btn-primary">
              Return to tasks
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTodoPage;