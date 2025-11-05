import 'server-only';

// Simple server-side sanitization without heavy dependencies
// For production, consider using a more robust sanitization library like DOMPurify
// when client-side sanitization is needed

/**
 * Simple HTML tag removal for server-side sanitization
 * @param input - The input string to sanitize
 * @param strict - If true, removes all HTML tags
 * @returns Sanitized string
 */
export function sanitizeHtml(input: string, strict: boolean = false): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  if (strict) {
    // Remove all HTML tags and decode entities
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .trim();
  }

  // Less strict - only remove dangerous tags
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .trim();
}

/**
 * Sanitize user text input (removes all HTML and scripts)
 * @param input - The user input to sanitize
 * @returns Clean text string
 */
export function sanitizeUserInput(input: string): string {
  return sanitizeHtml(input, true);
}

/**
 * Sanitize object properties recursively
 * @param obj - Object to sanitize
 * @param strict - If true, removes all HTML tags
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  strict: boolean = true
): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sanitized = { ...obj };

  for (const key in sanitized) {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value, strict) as T[Extract<keyof T, string>];
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, strict);
    }
  }

  return sanitized;
}

/**
 * Validate and sanitize email addresses
 * @param email - Email address to validate
 * @returns Clean email or throws error
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email format');
  }

  // Remove any HTML tags and trim whitespace
  const cleaned = sanitizeHtml(email, true).trim().toLowerCase();
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format');
  }

  return cleaned;
}

/**
 * Sanitize SQL-like injection attempts
 * @param input - Input to check for SQL injection
 * @returns Sanitized string
 */
export function sanitizeSqlInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove potential SQL injection patterns
  const dangerous = /('|(\')|;|--|\/\*|\*\/|xp_|sp_|exec|execute|declare|create|alter|drop|truncate|delete|insert|update|union|select)/gi;
  
  return input.replace(dangerous, '').trim();
}

/**
 * Sanitize file names to prevent directory traversal
 * @param filename - Filename to sanitize
 * @returns Safe filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/[\.\/\\:*?"<>|]/g, '')
    .replace(/\.\./g, '')
    .trim()
    .substring(0, 255); // Limit length
}

/**
 * Sanitize JSON data before processing
 * @param jsonString - JSON string to sanitize
 * @returns Parsed and sanitized object
 */
export function sanitizeJson<T>(jsonString: string): T | null {
  try {
    const parsed = JSON.parse(jsonString);
    return sanitizeObject(parsed);
  } catch (error) {
    console.error('JSON sanitization error:', error);
    return null;
  }
}

/**
 * Check if string contains potentially dangerous content
 * @param input - Input string to check
 * @returns true if dangerous content detected
 */
export function containsDangerousContent(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /onload=/gi,
    /onerror=/gi,
    /onclick=/gi,
    /eval\(/gi,
    /expression\(/gi,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Rate limit aware input sanitization (for high-frequency endpoints)
 * @param input - Input to sanitize
 * @param maxLength - Maximum allowed length
 * @returns Sanitized and truncated input
 */
export function sanitizeWithLimits(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // First sanitize, then truncate
  const sanitized = sanitizeUserInput(input);
  
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength);
  }

  return sanitized;
}