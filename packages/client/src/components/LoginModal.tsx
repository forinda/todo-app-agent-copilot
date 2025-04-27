import React, { useState } from 'react';
import { X, User, Mail, Lock, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRegistering: boolean;
  toggleMode: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  isRegistering, 
  toggleMode 
}) => {
  const { login, register, error, loading, clearError } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Close modal if not open
  if (!isOpen) return null;

  const validateForm = (): boolean => {
    clearError();
    setFormError(null);

    if (isRegistering && !name.trim()) {
      setFormError('Name is required');
      return false;
    }

    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setFormError('Password is required');
      return false;
    }

    if (isRegistering && password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isRegistering) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      // Error handling is done by the AuthContext
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-slide-up overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-8 text-white text-center">
          <User className="w-12 h-12 bg-white text-indigo-600 rounded-full p-2 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">
            {isRegistering ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="mt-1 text-indigo-200">
            {isRegistering 
              ? 'Sign up to start organizing your tasks' 
              : 'Sign in to access your tasks'}
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error display */}
          {(error || formError) && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error || formError}</span>
            </div>
          )}
          
          {/* Name field (only show for register) */}
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-10"
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}
          
          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder={isRegistering ? "Create password" : "Enter password"}
                required
                disabled={loading}
              />
            </div>
            {!isRegistering && (
              <div className="mt-1 text-right">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot password?
                </a>
              </div>
            )}
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary w-full py-3 mt-4"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                {isRegistering ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              isRegistering ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 text-center border-t">
          <p>
            {isRegistering ? 'Already have an account?' : 'Need an account?'}{' '}
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={toggleMode}
              disabled={loading}
            >
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;