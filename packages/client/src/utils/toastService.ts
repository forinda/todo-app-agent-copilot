import toast from 'react-hot-toast';
import { ApiResponse } from '../types';

/**
 * Toast service for displaying notifications
 */
export const toastService = {
  /**
   * Show success toast with message from API response
   */
  success: (message: string) => {
    toast.success(message);
  },

  /**
   * Show error toast with message from API response
   */
  error: (message: string) => {
    toast.error(message);
  },

  /**
   * Show loading toast
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Handle API response and show appropriate toast
   */
  handleResponse: <T>(response: ApiResponse<T>, customMessage?: string): T | undefined => {
    if (response.success) {
      toast.success(customMessage || response.message);
      return response.data;
    } else {
      const errorMessage = response.error?.details 
        ? `${response.message}: ${JSON.stringify(response.error.details)}`
        : response.message;
      
      toast.error(errorMessage);
      return undefined;
    }
  },

  /**
   * Handle API error
   */
  handleError: (error: any) => {
    // Extract error message from various error formats
    const message = error?.response?.data?.message || 
                   error?.message || 
                   'An unexpected error occurred';
    
    toast.error(message);
  },

  /**
   * Show a promise toast that resolves based on the promise result
   * @returns The result of the promise if successful
   */
  promise: <T>(
    promise: Promise<T>, 
    messages: { loading: string; success: string; error: string }
  ): Promise<T> => {
    return toast.promise(promise, messages);
  }
};