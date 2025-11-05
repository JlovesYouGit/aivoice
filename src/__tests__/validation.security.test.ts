import { loginSchema, signupSchema, chatMessageSchema, paymentSchema, voiceSynthesisSchema } from '@/utils/validation/schemas';

describe('Input Validation Security Tests', () => {
  describe('Login Schema Validation', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123'
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123'
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const invalidData = {
        email: 'test@example.com'
        // missing password
      };
      
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Signup Schema Validation', () => {
    it('should validate correct signup data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123'
      };
      
      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Chat Message Schema Validation', () => {
    it('should validate correct chat message', () => {
      const validData = {
        message: 'Hello, how are you today?'
      };
      
      const result = chatMessageSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty messages', () => {
      const invalidData = {
        message: ''
      };
      
      const result = chatMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject overly long messages', () => {
      const invalidData = {
        message: 'A'.repeat(1001) // 1001 characters, exceeds max of 1000
      };
      
      const result = chatMessageSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Payment Schema Validation', () => {
    it('should validate correct payment data', () => {
      const validData = {
        planId: 'premium',
        userId: 'user-123'
      };
      
      const result = paymentSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid plan IDs', () => {
      const invalidData = {
        planId: 'invalid-plan',
        userId: 'user-123'
      };
      
      const result = paymentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing user ID', () => {
      const invalidData = {
        planId: 'free'
        // missing userId
      };
      
      const result = paymentSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Voice Synthesis Schema Validation', () => {
    it('should validate correct voice synthesis data', () => {
      const validData = {
        text: 'Hello, this is a test message',
        voiceId: 'female-1',
        speed: 1.0
      };
      
      const result = voiceSynthesisSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty text', () => {
      const invalidData = {
        text: '',
        voiceId: 'female-1',
        speed: 1.0
      };
      
      const result = voiceSynthesisSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid speed values', () => {
      const invalidData = {
        text: 'Test message',
        voiceId: 'female-1',
        speed: 3.0 // exceeds max of 2.0
      };
      
      const result = voiceSynthesisSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});