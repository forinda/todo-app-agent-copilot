import { Request, Response, NextFunction } from 'express';
import { ApiError, HttpStatus } from './errors/base';
import { convertError } from './errors/errorConverters';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  meta?: {
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
    [key: string]: any;
  };
  error?: {
    code?: string;
    details?: any;
    type?: string;
  };
}

/**
 * Creates a standardized successful response
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  message = 'Operation successful',
  statusCode = HttpStatus.OK,
  meta?: ApiResponse['meta']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    statusCode,
    data
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Creates a standardized error response from an ApiError
 */
export const errorResponseFromApiError = (
  res: Response,
  error: ApiError
): Response => {
  const response: ApiResponse = {
    success: false,
    message: error.message,
    statusCode: error.statusCode,
    error: {
      code: error.metadata?.code,
      type: error.metadata?.type,
      details: error.metadata?.details,
      ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {})
    }
  };

  return res.status(error.statusCode).json(response);
};

/**
 * Creates a standardized error response
 */
export const errorResponse = (
  res: Response,
  message = 'An error occurred',
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  errorCode?: string,
  details?: any
): Response => {
  const apiError = new ApiError(message, statusCode, {
    code: errorCode,
    details
  });
  
  return errorResponseFromApiError(res, apiError);
};

/**
 * Middleware that extends Express Response with methods for standardized responses
 */
export const responseFormatterMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Add success response method to response object
  res.success = <T>(data: T, message = 'Success', statusCode = HttpStatus.OK, meta?: ApiResponse['meta']) => {
    return successResponse(res, data, message, statusCode, meta);
  };

  // Add error response method to response object
  res.error = (message = 'Error', statusCode = HttpStatus.INTERNAL_SERVER_ERROR, errorCode?: string, details?: any) => {
    return errorResponse(res, message, statusCode, errorCode, details);
  };
  
  // Add method to handle any error by converting it to ApiError
  res.errorHandler = (error: unknown) => {
    const apiError = convertError(error);
    return errorResponseFromApiError(res, apiError);
  };

  next();
};

// Global error handler middleware
export const errorHandlerMiddleware = (
  err: Error | ApiError | unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Convert any error to ApiError
  const apiError = convertError(err);
  
  // Log error in development/staging
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      message: apiError.message,
      statusCode: apiError.statusCode,
      metadata: apiError.metadata,
      stack: apiError.stack
    });
  }
  
  return errorResponseFromApiError(res, apiError);
};

// Extend Express Response interface
declare global {
  namespace Express {
    interface Response {
      success<T>(data: T, message?: string, statusCode?: number, meta?: ApiResponse['meta']): Response;
      error(message?: string, statusCode?: number, errorCode?: string, details?: any): Response;
      errorHandler(error: unknown): Response;
    }
  }
}