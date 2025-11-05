import { chatMessageSchema, voiceSynthesisSchema, loginSchema, signupSchema, paymentSchema } from '@/utils/validation/schemas';
import { validateInput } from '@/utils/validation/validate';

describe('Validation Schemas', () => {
  describe('Chat Message Schema', () => {
    it('should validate a correct chat message', () => {
      const data = { message: 'Hello, how are you?' };
      const result = validateInput(chatMessageSchema, data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('Hello, how are you?');
      }
    });

    it('should reject an empty message', () => {
      const data = { message: '' };
      const result = validateInput(chatMessageSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject a message that is too long', () => {
      const data = { message: 'a'.repeat(1001) };
      const result = validateInput(chatMessageSchema, data);
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from message', () => {
      const data = { message: '  Hello world  ' };
      const result = validateInput(chatMessageSchema, data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('  Hello world  ');
      }
    });
  });

  describe('Voice Synthesis Schema', () => {
    it('should validate correct voice synthesis data', () => {
      const data = { 
        text: 'Hello world', 
        voiceId: 'female-1', 
        speed: 1.0 
      };
      const result = validateInput(voiceSynthesisSchema, data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.text).toBe('Hello world');
        expect(result.data.voiceId).toBe('female-1');
        expect(result.data.speed).toBe(1.0);
      }
    });

    it('should reject missing text', () => {
      const data = { voiceId: 'female-1', speed: 1.0 };
      const result = validateInput(voiceSynthesisSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject missing voiceId', () => {
      const data = { text: 'Hello world', speed: 1.0 };
      const result = validateInput(voiceSynthesisSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject speed outside valid range', () => {
      const data = { 
        text: 'Hello world', 
        voiceId: 'female-1', 
        speed: 3.0 
      };
      const result = validateInput(voiceSynthesisSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject speed below minimum range', () => {
      const data = { 
        text: 'Hello world', 
        voiceId: 'female-1', 
        speed: 0.1 
      };
      const result = validateInput(voiceSynthesisSchema, data);
      expect(result.success).toBe(false);
    });

    it('should validate speed at boundary values', () => {
      const dataMin = { 
        text: 'Hello world', 
        voiceId: 'female-1', 
        speed: 0.5 
      };
      const dataMax = { 
        text: 'Hello world', 
        voiceId: 'female-1', 
        speed: 2.0 
      };
      
      const resultMin = validateInput(voiceSynthesisSchema, dataMin);
      const resultMax = validateInput(voiceSynthesisSchema, dataMax);
      
      expect(resultMin.success).toBe(true);
      expect(resultMax.success).toBe(true);
    });
  });

  describe('Login Schema', () => {
    it('should validate correct login data', () => {
      const data = { 
        email: 'user@example.com', 
        password: 'password123' 
      };
      const result = validateInput(loginSchema, data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const data = { 
        email: 'invalid-email', 
        password: 'password123' 
      };
      const result = validateInput(loginSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const data = { 
        email: 'user@example.com', 
        password: '123' 
      };
      const result = validateInput(loginSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject empty email', () => {
      const data = { 
        email: '', 
        password: 'password123' 
      };
      const result = validateInput(loginSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const data = { 
        email: 'user@example.com', 
        password: '' 
      };
      const result = validateInput(loginSchema, data);
      expect(result.success).toBe(false);
    });

    it('should validate email with special characters', () => {
      const data = { 
        email: 'user.name+tag@example.com', 
        password: 'password123' 
      };
      const result = validateInput(loginSchema, data);
      expect(result.success).toBe(true);
    });
  });

  describe('Signup Schema', () => {
    it('should validate correct signup data', () => {
      const data = { 
        email: 'user@example.com', 
        password: 'password123',
        confirmPassword: 'password123'
      };
      const result = validateInput(signupSchema, data);
      expect(result.success).toBe(true);
    });

    it('should reject mismatched passwords', () => {
      const data = { 
        email: 'user@example.com', 
        password: 'password123',
        confirmPassword: 'different123'
      };
      const result = validateInput(signupSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject empty confirmPassword', () => {
      const data = { 
        email: 'user@example.com', 
        password: 'password123',
        confirmPassword: ''
      };
      const result = validateInput(signupSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject signup with invalid email', () => {
      const data = { 
        email: 'invalid-email', 
        password: 'password123',
        confirmPassword: 'password123'
      };
      const result = validateInput(signupSchema, data);
      expect(result.success).toBe(false);
    });
  });

  describe('Payment Schema', () => {
    it('should validate correct payment data', () => {
      const data = { 
        planId: 'premium', 
        userId: 'user-123' 
      };
      const result = validateInput(paymentSchema, data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid planId', () => {
      const data = { 
        planId: 'invalid-plan', 
        userId: 'user-123' 
      };
      const result = validateInput(paymentSchema, data);
      expect(result.success).toBe(false);
    });

    it('should validate all valid planIds', () => {
      const validPlans = ['free', 'premium', 'pro'];
      
      validPlans.forEach(planId => {
        const data = { 
          planId, 
          userId: 'user-123' 
        };
        const result = validateInput(paymentSchema, data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject empty userId', () => {
      const data = { 
        planId: 'premium', 
        userId: '' 
      };
      const result = validateInput(paymentSchema, data);
      expect(result.success).toBe(false);
    });

    it('should reject missing userId', () => {
      const data = { 
        planId: 'premium'
      };
      const result = validateInput(paymentSchema, data);
      expect(result.success).toBe(false);
    });
  });
});