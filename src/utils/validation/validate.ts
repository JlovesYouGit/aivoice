import { ZodSchema, z } from 'zod';
import { Errors } from '@/src/utils/errorHandler';

export function validateInput<T>(schema: ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
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