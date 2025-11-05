import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'
});

// Plan prices (in cents)
const plans = {
  free: {
    priceId: 'price_free',
    name: 'Free Plan',
    features: ['2000 context window', 'Text-based conversations', 'Basic emotional support']
  },
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID as string,
    name: 'Premium Plan',
    features: ['Unlimited context window', 'Voice-enabled conversations', 'Advanced emotional analysis']
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID as string,
    name: 'Pro Plan',
    features: ['All Premium features', '24/7 availability', 'Specialized therapy modules']
  }
};

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

export async function processPayment(data: PaymentData, origin: string): Promise<PaymentResult> {
  try {
    const { planId, userId } = data;

    // Validate plan
    if (!plans[planId]) {
      return {
        success: false,
        error: 'Invalid plan selected'
      };
    }

    // For free plan, just return success
    if (planId === 'free') {
      return {
        success: true,
        message: 'Free plan activated successfully'
      };
    }

    // Create Stripe checkout session for paid plans
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plans[planId].priceId as string,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancelled`,
      client_reference_id: userId,
      metadata: {
        planId: planId
      }
    });

    return {
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'Failed to create checkout session'
    };
  }
}