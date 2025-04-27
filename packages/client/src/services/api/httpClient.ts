import axios, { AxiosInstance, AxiosError } from 'axios';
import { toastService } from '../../utils/toastService';

// Create axios instance with default config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

/**
 * Core HTTP client with standard configuration
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This enables sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle response intercept for authentication errors
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Redirect to login page if not already there
      if (window.location.pathname !== '/') {
        toastService.error('Your session has expired. Please log in again.');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);