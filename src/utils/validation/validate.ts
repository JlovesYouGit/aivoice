import { ZodSchema, z } from 'zod';
import { Errors } from '@/utils/errorHandler';
import { sanitizeObject, containsDangerousContent } from '@/utils/sanitization';

export function validateInput<T>(schema: ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  // First, sanitize the input data
  let sanitizedData: unknown;
  
  if (typeof data === 'object' && data !== null) {
    sanitizedData = sanitizeObject(data as Record<string, any>);
  } else if (typeof data === 'string') {
    // Check for dangerous content before sanitization
    if (containsDangerousContent(data)) {
      return { success: false, errors: ['Input contains potentially dangerous content'] };
    }
    sanitizedData = data;
  } else {
    sanitizedData = data;
  }
  
  const result = schema.safeParse(sanitizedData);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errors = result.error.errors.map(error => error.message);
    return { success: false, errors };
  }
}

export function handleValidationError(errors: string[]) {
  return Errors.validation(errors);
}