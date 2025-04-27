import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';
import { toastService } from '../utils/toastService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Fetch the current user using the cookie-based authentication
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loadingToast = toastService.loading('Signing in...');
      
      const response = await authApi.login({ email, password });
      // After login, immediately fetch the current user to get their details
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      
      toastService.dismiss(loadingToast);
      toastService.success('Logged in successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loadingToast = toastService.loading('Creating your account...');
      
      await authApi.register({ name, email, password });
      // After registration, login the user automatically
      await login(email, password);
      
      toastService.dismiss(loadingToast);
      toastService.success('Account created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const loadingToast = toastService.loading('Logging out...');
      await authApi.logout();
      setUser(null);
      toastService.dismiss(loadingToast);
      toastService.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toastService.error('Failed to logout properly');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

