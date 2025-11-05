export interface PaymentData {
  planId: 'free' | 'premium' | 'pro';
  userId: string;
}

export interface PaymentResult {
  success: boolean;
  sessionId?: string;
  checkoutUrl?: string;
  message?: string;
  error?: string;
}