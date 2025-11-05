import { NextResponse } from 'next/server';

// Define error types
export interface ApiError {
  success: false;
  error: string;
  details?: string;
  code?: string;
  status: number;
}

// Standardized error response
export function createErrorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: string
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      status: status,
      ...(code && { code }),
      ...(details && { details }),
    },
    { status }
  );
}

// Validation error response
export function createValidationError(errors: string[]): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      status: 400,
      details: errors.join(', '),
      code: 'VALIDATION_ERROR',
    },
    { status: 400 }
  );
}

// Common error responses
export const Errors = {
  validation: (errors: string[]) => createValidationError(errors),
  
  unauthorized: () => createErrorResponse(
    'Unauthorized access',
    401,
    'UNAUTHORIZED'
  ),
  
  forbidden: () => createErrorResponse(
    'Access forbidden',
    403,
    'FORBIDDEN'
  ),
  
  notFound: (resource: string) => createErrorResponse(
    `${resource} not found`,
    404,
    'NOT_FOUND'
  ),
  
  conflict: (message: string) => createErrorResponse(
    message,
    409,
    'CONFLICT'
  ),
  
  internal: (error?: Error) => {
    console.error('Internal server error:', error);
    return createErrorResponse(
      'Internal server error',
      500,
      'INTERNAL_ERROR',
      error?.message
    );
  },
  
  badRequest: (message: string) => createErrorResponse(
    message,
    400,
    'BAD_REQUEST'
  ),
  
  serviceUnavailable: (service: string) => createErrorResponse(
    `${service} service unavailable`,
    503,
    'SERVICE_UNAVAILABLE'
  ),
};