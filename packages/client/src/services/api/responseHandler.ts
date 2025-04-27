import { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, ApiError } from '../../types';
import { toastService } from '../../utils/toastService';

/**
 * Handles standardized API responses and extracts data
 */
export function handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const apiResponse = response.data;
  
  if (!apiResponse.success) {
    const errorMessage = apiResponse.error?.details 
      ? `${apiResponse.message}: ${JSON.stringify(apiResponse.error.details)}`
      : apiResponse.message;
      
    toastService.error(errorMessage);
    
    throw {
      message: apiResponse.message || 'An error occurred',
      status: apiResponse.statusCode,
      code: apiResponse.error?.code,
      details: apiResponse.error?.details,
    };
  }
  
  // Only show success toasts for non-GET requests
  if (!['GET'].includes(response.config.method?.toUpperCase() || '')) {
    toastService.success(apiResponse.message);
  }
  
  return apiResponse.data as T;
}

/**
 * Handles API errors and provides standardized error responses
 */
export function handleError(error: AxiosError<ApiResponse>): never {
  if (error.response) {
    const apiResponse = error.response.data;
    const errorMessage = apiResponse.error?.details 
      ? `${apiResponse.message}: ${JSON.stringify(apiResponse.error.details)}`
      : apiResponse.message || 'An unexpected error occurred';
      
    toastService.error(errorMessage);
    
    throw {
      message: apiResponse.message || 'An unexpected error occurred',
      status: apiResponse.statusCode || error.response.status,
      code: apiResponse.error?.code,
      details: apiResponse.error?.details,
    };
  }
  
  toastService.error(error.message || 'Network error occurred');
  
  throw {
    message: error.message || 'Network error occurred',
    status: 500,
  };
}

/**
 * Extracts metadata from API responses
 */
export function extractMeta<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T>['meta'] {
  return response.data.meta;
}

/**
 * Builds query parameters for GET requests
 */
export function buildQueryParams(options: Record<string, any>): Record<string, string> {
  const params: Record<string, string> = {};
  
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        params[key] = JSON.stringify(value);
      } else {
        params[key] = String(value);
      }
    }
  });
  
  return params;
}