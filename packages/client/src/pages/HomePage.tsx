import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  CheckSquare, 
  Filter, 
  RefreshCw, 
  LayoutGrid,
  List as ListIcon,
  Search,
  SlidersHorizontal,
  Calendar,
  CheckCheck,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { useTodos, useDeleteTodo, useCompleteTodo, useBulkTodoActions } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import { useUsers } from '../hooks/useUsers';
import { TodoItem } from '../components/TodoItem';
import { DataTable } from '../components/DataTable';
import { Todo, PaginationOptions, TodoFilterOptions, SortOptions, User } from '../types';
import { formatDate } from '../utils/formatters';

const HomePage: React.FC = () => {
  // Filter and pagination state
  const [filterOptions, setFilterOptions] = useState<TodoFilterOptions>({});
  const [paginationOptions, setPaginationOptions] = useState<PaginationOptions>({ 
    page: 1, 
    limit: 10 
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc'
  });
  
  const [view, setView] = useState<'list' | 'table'>('list');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // React Query hooks
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useTodos(paginationOptions, filterOptions, sortOptions);
  
  const deleteTodoMutation = useDeleteTodo();
  const completeTodoMutation = useCompleteTodo();
  const { categories } = useCategories();
  const { users, loading: loadingUsers } = useUsers();
  const { 
    selectedTodos, 
    setSelectedTodos,
    bulkDelete,
    bulkComplete,
    isLoading: isBulkActionLoading
  } = useBulkTodoActions();

  // Column configuration for TanStack Table
  const columnHelper = createColumnHelper<Todo>();
  
  const columns = [
    columnHelper.display({
      id: 'status',
      header: '',
      cell: info => (
        <div className="flex justify-center">
          <div 
            onClick={() => !info.row.original.completed && handleCompleteTodo(info.row.original.id)}
            className={`w-5 h-5 rounded-full border ${
              info.row.original.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 hover:border-indigo-500 cursor-pointer'
            } flex items-center justify-center`}
          >
            {info.row.original.completed && <CheckCheck size={12} className="text-white" />}
          </div>
        </div>
      ),
      size: 40
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => (
        <div>
          <div className={`font-medium ${info.row.original.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {info.getValue()}
          </div>
          {info.row.original.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {info.row.original.description}
            </div>
          )}
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => {
        const category = info.getValue();
        if (!category) return null;
        
        return (
          <span 
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `${category.color}15`,
              color: category.color,
            }}
          >
            <Tag size={12} />
            {category.name}
          </span>
        );
      },
    }),
    columnHelper.accessor('dueDate', {
      header: 'Due Date',
      cell: info => {
        if (!info.getValue()) return null;
        
        const date = new Date(info.getValue() as string);
        const isOverdue = !info.row.original.completed && date < new Date();
        
        return (
          <span className={`inline-flex items-center gap-1 text-sm ${
            isOverdue ? 'text-red-600' : 'text-gray-600'
          }`}>
            <Clock size={14} />
            {formatDate(date)}
          </span>
        );
      }
    }),
    columnHelper.accessor('completed', {
      header: 'Status',
      cell: info => (
        <span 
          className={`px-2 py-1 text-xs rounded-full ${
            info.getValue() 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {info.getValue() ? 'Completed' : 'Pending'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: props => {
        const todo = props.row.original;
        return (
          <div className="flex space-x-2">
            {!todo.completed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteTodo(todo.id);
                }}
                className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                title="Complete"
              >
                <CheckSquare size={16} />
              </button>
            )}
            <Link
              to={`/dashboard/todos/edit/${todo.id}`}
              className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit"
              onClick={(e) => e.stopPropagation()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTodo(todo.id);
              }}
              className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    }),
  ];

  // Handlers
  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTodoMutation.mutateAsync(id);
    }
  };

  const handleCompleteTodo = async (id: number) => {
    await completeTodoMutation.mutateAsync(id);
  };

  const handleBulkDelete = async () => {
    if (selectedTodos.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedTodos.length} task(s)?`)) {
      await bulkDelete(selectedTodos.map(todo => todo.id));
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTodos.length === 0) return;
    await bulkComplete(selectedTodos.map(todo => todo.id));
  };

  // Filter handlers
  const handleCategoryFilterChange = (categoryId: number | 'all') => {
    setFilterOptions(prev => ({
      ...prev,
      categoryId: categoryId === 'all' ? undefined : categoryId
    }));
    setPaginationOptions(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleCompletedFilterChange = (completed: boolean | 'all') => {
    setFilterOptions(prev => ({
      ...prev,
      completed: completed === 'all' ? undefined : completed
    }));
    setPaginationOptions(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSearchChange = (search: string) => {
    setFilterOptions(prev => ({
      ...prev,
      search: search || undefined
    }));
    setPaginationOptions(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPaginationOptions(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPaginationOptions(prev => ({ ...prev, limit, page: 1 }));
  };

  // Sorting handlers
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortOptions({ field, direction });
  };

  // Render bulk action buttons
  const renderBulkActions = () => (
    <div className="flex space-x-2">
      <button
        onClick={handleBulkComplete}
        disabled={isBulkActionLoading}
        className="btn btn-success btn-sm"
      >
        <CheckSquare className="w-4 h-4" />
        Complete
      </button>
      <button
        onClick={handleBulkDelete}
        disabled={isBulkActionLoading}
        className="btn btn-danger btn-sm"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );

  if (error) {
    return (
      <div className="card p-6 bg-red-50 text-red-800 flex flex-col items-center">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
        <p className="text-center mb-4">{error.message}</p>
        <button 
          onClick={() => refetch()}
          className="btn btn-primary"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">My Tasks</h1>
          <p className="text-gray-500">
            {data?.total 
              ? `You have ${data.todos.filter(t => !t.completed).length} pending tasks out of ${data.total} total`
              : 'Start organizing your tasks'
            }
          </p>
        </div>
        <Link
          to="/dashboard/todos/create"
          className="btn btn-primary"
        >
          <Plus className="mr-1" size={20} />
          New Task
        </Link>
      </div>
      
      {/* Filters and view toggle */}
      <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-auto md:min-w-[240px] flex-grow md:flex-grow-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={filterOptions.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-full pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary btn-sm"
              title="Toggle filters"
            >
              <SlidersHorizontal size={16} />
              <span className="ml-1">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            
            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="btn btn-secondary btn-sm"
              title="Refresh data"
            >
              <RefreshCw size={16} />
            </button>
            
            {/* View toggle */}
            <div className="bg-gray-100 rounded-md flex">
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-l-md transition-colors ${
                  view === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
                title="List view"
              >
                <ListIcon size={18} />
              </button>
              <button
                onClick={() => setView('table')}
                className={`p-2 rounded-r-md transition-colors ${
                  view === 'table' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
                title="Table view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Extended filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Tag size={16} /> 
                Category
              </label>
              <select
                value={filterOptions.categoryId || 'all'}
                onChange={(e) => handleCategoryFilterChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <CheckSquare size={16} /> 
                Status
              </label>
              <select
                value={filterOptions.completed === undefined ? 'all' : filterOptions.completed.toString()}
                onChange={(e) => handleCompletedFilterChange(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar size={16} /> 
                Sort By
              </label>
              <div className="flex">
                <select
                  value={sortOptions.field}
                  onChange={(e) => handleSortChange(e.target.value, sortOptions.direction)}
                  className="block w-2/3 rounded-l-md border-r-0 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="dueDate">Due Date</option>
                  <option value="title">Title</option>
                </select>
                <select
                  value={sortOptions.direction}
                  onChange={(e) => handleSortChange(sortOptions.field, e.target.value as 'asc' | 'desc')}
                  className="block w-1/3 rounded-r-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Todo content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {data && data.todos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-gray-500">Get started by creating your first task</p>
              <div className="mt-6">
                <Link to="/dashboard/todos/create" className="btn btn-primary">
                  <Plus size={16} className="mr-1" />
                  Create new task
                </Link>
              </div>
            </div>
          ) : (
            view === 'table' ? (
              <div className="p-4">
                <DataTable 
                  data={data?.todos || []}
                  columns={columns}
                  pagination={{
                    pageCount: data ? Math.ceil(data.total / paginationOptions.limit) : 0,
                    page: paginationOptions.page - 1, // DataTable uses 0-indexed pages
                    pageSize: paginationOptions.limit,
                    onPageChange: (page) => handlePageChange(page + 1), // Convert back to 1-indexed
                    onPageSizeChange: handleLimitChange
                  }}
                  sorting={{
                    sortBy: sortOptions.field,
                    sortDirection: sortOptions.direction,
                    onSortChange: handleSortChange
                  }}
                  enableRowSelection
                  onRowSelectionChange={setSelectedTodos}
                  bulkActions={renderBulkActions()}
                />
              </div>
            ) : (
              <div className="p-4">
                <div className="space-y-1">
                  {data?.todos.map(todo => (
                    <TodoItem 
                      key={todo.id} 
                      todo={todo} 
                      onDelete={handleDeleteTodo}
                      onComplete={handleCompleteTodo}
                      users={users}
                    />
                  ))}
                </div>
                
                {/* Simple pagination for list view */}
                {data && data.total > paginationOptions.limit && (
                  <div className="flex justify-center mt-8">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(paginationOptions.page - 1, 1))}
                        disabled={paginationOptions.page === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft size={16} className="mr-1" />
                        Previous
                      </button>
                      
                      <button
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-indigo-600 pointer-events-none"
                      >
                        Page {paginationOptions.page} of {Math.ceil((data.total || 0) / paginationOptions.limit)}
                      </button>
                      
                      <button
                        onClick={() => handlePageChange(Math.min(paginationOptions.page + 1, Math.ceil((data.total || 0) / paginationOptions.limit)))}
                        disabled={paginationOptions.page >= Math.ceil((data.total || 0) / paginationOptions.limit)}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;