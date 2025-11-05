import { z } from 'zod';

// Define a message schema for conversation history
const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(1000),
  timestamp: z.number().optional(),
});

// Chat message schema
export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message is too long'),
  history: z.array(messageSchema).optional(),
});

// Voice synthesis schema
export const voiceSynthesisSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text is too long'),
  voiceId: z.string().min(1, 'Voice ID is required'),
  speed: z.number().min(0.5).max(2.0).default(1.0),
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// User signup schema
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Payment schema
export const paymentSchema = z.object({
  planId: z.enum(['free', 'premium', 'pro'], {
    errorMap: () => ({ message: 'Invalid plan selected' }),
  }),
  userId: z.string().min(1, 'User ID is required'),
});

// Export types
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type VoiceSynthesis = z.infer<typeof voiceSynthesisSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type MessageHistory = z.infer<typeof messageSchema>;