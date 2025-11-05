import CryptoJS from 'crypto-js';

/**
 * Client-side encryption utilities for sensitive data
 * Used in static deployment where server-side encryption isn't available
 */

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'fallback-key-change-in-production';
const STORAGE_PREFIX = 'serene_encrypted_';

export class ClientEncryption {
  /**
   * Encrypt sensitive data before storing or transmitting
   */
  static encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt encrypted data
   */
  static decrypt(encryptedData: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Invalid encrypted data or key');
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash data for verification (one-way)
   */
  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Generate secure random string
   */
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Secure localStorage with encryption
   */
  static secureSetItem(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value);
      localStorage.setItem(STORAGE_PREFIX + key, encrypted);
    } catch (error) {
      console.error('Secure storage error:', error);
      throw new Error('Failed to store encrypted data');
    }
  }

  /**
   * Retrieve and decrypt from localStorage
   */
  static secureGetItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(STORAGE_PREFIX + key);
      if (!encrypted) return null;
      
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Secure retrieval error:', error);
      return null;
    }
  }

  /**
   * Remove encrypted item from localStorage
   */
  static secureRemoveItem(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  /**
   * Clear all encrypted items
   */
  static secureClearAll(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * API Key Management for client-side requests
 */
export class ApiKeyManager {
  private static readonly API_KEY_STORAGE = 'api_keys';
  
  /**
   * Store API key securely
   */
  static storeApiKey(service: string, key: string): void {
    try {
      const existingKeys = this.getAllApiKeys();
      existingKeys[service] = key;
      
      const keysJson = JSON.stringify(existingKeys);
      ClientEncryption.secureSetItem(this.API_KEY_STORAGE, keysJson);
    } catch (error) {
      console.error('API key storage error:', error);
      throw new Error('Failed to store API key');
    }
  }

  /**
   * Retrieve API key securely
   */
  static getApiKey(service: string): string | null {
    try {
      const keys = this.getAllApiKeys();
      return keys[service] || null;
    } catch (error) {
      console.error('API key retrieval error:', error);
      return null;
    }
  }

  /**
   * Remove API key
   */
  static removeApiKey(service: string): void {
    try {
      const keys = this.getAllApiKeys();
      delete keys[service];
      
      const keysJson = JSON.stringify(keys);
      ClientEncryption.secureSetItem(this.API_KEY_STORAGE, keysJson);
    } catch (error) {
      console.error('API key removal error:', error);
    }
  }

  /**
   * Get all stored API keys
   */
  private static getAllApiKeys(): Record<string, string> {
    try {
      const keysJson = ClientEncryption.secureGetItem(this.API_KEY_STORAGE);
      return keysJson ? JSON.parse(keysJson) : {};
    } catch (error) {
      console.error('API keys parsing error:', error);
      return {};
    }
  }

  /**
   * Clear all API keys
   */
  static clearAllApiKeys(): void {
    ClientEncryption.secureRemoveItem(this.API_KEY_STORAGE);
  }
}

/**
 * Session Management with encryption
 */
export class SecureSession {
  private static readonly SESSION_KEY = 'user_session';
  private static readonly TOKEN_KEY = 'auth_token';
  
  /**
   * Store user session securely
   */
  static storeSession(sessionData: any): void {
    try {
      const sessionJson = JSON.stringify({
        ...sessionData,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      });
      
      ClientEncryption.secureSetItem(this.SESSION_KEY, sessionJson);
    } catch (error) {
      console.error('Session storage error:', error);
      throw new Error('Failed to store session');
    }
  }

  /**
   * Retrieve user session
   */
  static getSession(): any | null {
    try {
      const sessionJson = ClientEncryption.secureGetItem(this.SESSION_KEY);
      if (!sessionJson) return null;
      
      const session = JSON.parse(sessionJson);
      
      // Check if session is expired
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Session retrieval error:', error);
      this.clearSession(); // Clear corrupted session
      return null;
    }
  }

  /**
   * Check if user has valid session
   */
  static isSessionValid(): boolean {
    const session = this.getSession();
    return session !== null && session.expiresAt > Date.now();
  }

  /**
   * Store authentication token
   */
  static storeAuthToken(token: string): void {
    ClientEncryption.secureSetItem(this.TOKEN_KEY, token);
  }

  /**
   * Get authentication token
   */
  static getAuthToken(): string | null {
    return ClientEncryption.secureGetItem(this.TOKEN_KEY);
  }

  /**
   * Clear user session and token
   */
  static clearSession(): void {
    ClientEncryption.secureRemoveItem(this.SESSION_KEY);
    ClientEncryption.secureRemoveItem(this.TOKEN_KEY);
  }

  /**
   * Extend session expiry
   */
  static extendSession(): void {
    const session = this.getSession();
    if (session) {
      session.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
      this.storeSession(session);
    }
  }
}

/**
 * Form data sanitization and encryption
 */
export class SecureFormData {
  /**
   * Sanitize and encrypt form data before submission
   */
  static processFormData(formData: Record<string, any>): Record<string, any> {
    const processed: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        // Sanitize HTML and potentially dangerous content
        const sanitized = this.sanitizeInput(value);
        
        // Encrypt sensitive fields
        if (this.isSensitiveField(key)) {
          processed[key] = ClientEncryption.encrypt(sanitized);
        } else {
          processed[key] = sanitized;
        }
      } else {
        processed[key] = value;
      }
    }
    
    return processed;
  }

  /**
   * Sanitize user input
   */
  private static sanitizeInput(input: string): string {
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Check if field contains sensitive data
   */
  private static isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = [
      'password',
      'email',
      'phone',
      'creditCard',
      'ssn',
      'apiKey',
      'token',
      'secret'
    ];
    
    const lowerFieldName = fieldName.toLowerCase();
    return sensitiveFields.some(field => lowerFieldName.includes(field));
  }
}

/**
 * Environment variables validation
 */
export class EnvironmentValidator {
  /**
   * Validate required environment variables are present
   */
  static validateEnvironment(): { valid: boolean; missing: string[] } {
    const required = [
      'NEXT_PUBLIC_SITE_URL',
      'NEXT_PUBLIC_ENCRYPTION_KEY'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Check if running in production
   */
  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production' || 
           process.env.NEXT_PUBLIC_SITE_URL?.includes('evalion.free.nf');
  }

  /**
   * Get secure configuration
   */
  static getSecureConfig() {
    const validation = this.validateEnvironment();
    
    if (!validation.valid) {
      console.warn('Missing environment variables:', validation.missing);
    }
    
    return {
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
      apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
      encryptionEnabled: !!process.env.NEXT_PUBLIC_ENCRYPTION_KEY,
      isProduction: this.isProduction(),
      cloudflareAccountId: process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID || '',
    };
  }
}