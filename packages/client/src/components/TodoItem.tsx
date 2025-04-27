import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Edit, Trash, Clock, Users, CalendarClock, Tag } from 'lucide-react';
import { formatRelativeDate } from '../utils/formatters';
import { Todo, User } from '../types';

interface TodoItemProps {
  todo: Todo;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  users?: User[];
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onComplete,
  onDelete,
  users = [],
}) => {
  const navigate = useNavigate();
  
  // Format due date if it exists
  const formattedDueDate = todo.dueDate 
    ? formatRelativeDate(new Date(todo.dueDate))
    : null;
  
  // Find assigned users
  const assignedUsers = users.filter(
    user => todo.assignedUserIds?.includes(user.id)
  );

  // Calculate if overdue
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();
  
  // Handle click on item
  const handleItemClick = () => {
    navigate(`/todos/edit/${todo.id}`);
  };

  return (
    <div
      className={`card card-hover mb-3 animate-fade-in ${
        todo.completed
          ? 'border-l-4 border-l-green-500'
          : isOverdue
            ? 'border-l-4 border-l-red-500'
            : 'border-l-4 border-l-indigo-500'
      }`}
    >
      <div className="flex items-center p-4">
        {/* Status checkbox */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            if (!todo.completed) onComplete(todo.id);
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${
            todo.completed 
              ? 'bg-green-500 border-green-500 flex items-center justify-center cursor-default' 
              : 'border-gray-300 hover:border-indigo-500 cursor-pointer'
          }`}
        >
          {todo.completed && <Check size={14} className="text-white" />}
        </div>
        
        {/* Content */}
        <div 
          className="flex-grow ml-4 cursor-pointer"
          onClick={handleItemClick}
        >
          <div className="flex items-center justify-between">
            <h3 
              className={`font-medium text-gray-900 ${
                todo.completed ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.title}
            </h3>
            
            <div className="flex items-center gap-1 ml-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/todos/edit/${todo.id}`);
                }}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                aria-label="Edit todo"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                aria-label="Delete todo"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
          
          {todo.description && (
            <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {todo.description.length > 120 
                ? `${todo.description.substring(0, 120)}...` 
                : todo.description
              }
            </p>
          )}
          
          {/* Meta information */}
          <div className="flex flex-wrap gap-3 mt-2">
            {/* Category badge */}
            {todo.category && (
              <span 
                className="badge flex items-center gap-1"
                style={{
                  backgroundColor: `${todo.category.color}15`,
                  color: todo.category.color,
                }}
              >
                <Tag size={12} />
                {todo.category.name}
              </span>
            )}
            
            {/* Due date */}
            {formattedDueDate && (
              <span className={`badge flex items-center gap-1 ${
                isOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <CalendarClock size={12} />
                {formattedDueDate}
              </span>
            )}
            
            {/* Assigned users */}
            {assignedUsers.length > 0 && (
              <span className="badge flex items-center gap-1 bg-gray-100 text-gray-800">
                <Users size={12} />
                {assignedUsers.length > 1 
                  ? `${assignedUsers.length} users` 
                  : assignedUsers[0].name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};