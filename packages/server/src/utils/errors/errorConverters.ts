import { ZodError } from 'zod';
import { DatabaseError } from 'pg';
import { ApiError, BadRequestError, ConflictError, HttpStatus, InternalServerError, ValidationError } from './base';

/**
 * Convert Zod validation error to ApiError
 */
export function convertZodError(error: ZodError): ValidationError {
  const firstIssue = error.issues[0];
  const path = firstIssue.path.join('.');
  
  const message = path 
    ? firstIssue.message.toLowerCase().includes(path.toLowerCase())
      ? firstIssue.message
      : `[${path}] ${firstIssue.message}`
    : firstIssue.message;

  return new ValidationError(message, {
    code: 'VALIDATION_ERROR',
    details: error.issues.map(issue => ({
      path: issue.path,
      message: issue.message,
      code: issue.code
    }))
  });
}

/**
 * Convert database error to ApiError
 */
export function convertDatabaseError(error: any): ApiError {
  // Handle PostgreSQL error codes
  if (error instanceof DatabaseError) {
    // Unique constraint violation
    if (error.code === '23505') {
      return new ConflictError('Resource already exists', {
        code: 'UNIQUE_VIOLATION',
        details: error.detail
      });
    }
    
    // Foreign key constraint violation
    if (error.code === '23503') {
      return new BadRequestError('Referenced resource does not exist', {
        code: 'FOREIGN_KEY_VIOLATION',
        details: error.detail
      });
    }
    
    // Not null constraint violation
    if (error.code === '23502') {
      return new BadRequestError('Required field is missing', {
        code: 'NOT_NULL_VIOLATION',
        details: error.detail
      });
    }
  }
  
  // Drizzle ORM errors
  if (error.name === 'DrizzleError') {
    return new BadRequestError('Database operation failed', {
      code: 'DRIZZLE_ERROR',
      details: error.message
    });
  }

  // Default to internal server error for unknown database issues
  return new InternalServerError('Database operation failed', { 
    code: 'DATABASE_ERROR' 
  }, error);
}

/**
 * Convert any error to ApiError
 */
export function convertError(error: unknown): ApiError {
  // Already an ApiError
  if (error instanceof ApiError) {
    return error;
  }
  
  // Zod validation error
  if (error instanceof ZodError) {
    return convertZodError(error);
  }
  
  // Handle database errors
  if (error instanceof DatabaseError || 
      (error instanceof Error && error.name === 'DrizzleError')) {
    return convertDatabaseError(error);
  }
  
  // Standard JS Error
  if (error instanceof Error) {
    return new InternalServerError(error.message, {
      code: 'UNKNOWN_ERROR',
      name: error.name
    }, error);
  }
  
  // Unknown error type
  return new InternalServerError(
    typeof error === 'string' ? error : 'An unknown error occurred', 
    { code: 'UNKNOWN_ERROR' },
    error instanceof Error ? error : undefined
  );
}