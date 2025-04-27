/**
 * HttpStatus enum for standard HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Error type for additional error metadata
 */
export type ErrorMetadata = {
  type?: string;
  code?: string;
  details?: any;
  field?: string;
  [key: string]: any;
};

/**
 * Base API Error class that all application errors should extend
 */
export class ApiError extends Error {
  public statusCode: HttpStatus;
  public metadata: ErrorMetadata;
  public originalError?: Error;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    metadata: ErrorMetadata = {},
    originalError?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.metadata = metadata;
    this.originalError = originalError;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Get error details formatted for response
   */
  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      ...this.metadata,
      ...(process.env.NODE_ENV !== 'production' && this.stack ? { stack: this.stack } : {})
    };
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', metadata: ErrorMetadata = {}) {
    super(message, HttpStatus.NOT_FOUND, { type: 'not_found', ...metadata });
  }
}

/**
 * Bad Request Error (400)
 */
export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', metadata: ErrorMetadata = {}) {
    super(message, HttpStatus.BAD_REQUEST, { type: 'bad_request', ...metadata });
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized', metadata: ErrorMetadata = {}) {
    super(message, HttpStatus.UNAUTHORIZED, { type: 'unauthorized', ...metadata });
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden', metadata: ErrorMetadata = {}) {
    super(message, HttpStatus.FORBIDDEN, { type: 'forbidden', ...metadata });
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', metadata: ErrorMetadata = {}) {
    super(message, HttpStatus.CONFLICT, { type: 'conflict', ...metadata });
  }
}

/**
 * Validation Error (422)
 */
export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', metadata: ErrorMetadata = {}) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, { type: 'validation_error', ...metadata });
  }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', metadata: ErrorMetadata = {}, originalError?: Error) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, { type: 'internal_error', ...metadata }, originalError);
  }
}