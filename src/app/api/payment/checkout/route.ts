import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { paymentSchema } from '@/utils/validation/schemas'
import { validateInput, handleValidationError } from '@/utils/validation/validate'
import { Errors } from '@/utils/errorHandler'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

// Plan prices (in cents)
const plans = {
  free: {
    priceId: 'price_free',
    name: 'Free Plan',
    features: ['2000 context window', 'Text-based conversations', 'Basic emotional support']
  },
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    name: 'Premium Plan',
    features: ['Unlimited context window', 'Voice-enabled conversations', 'Advanced emotional analysis']
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    name: 'Pro Plan',
    features: ['All Premium features', '24/7 availability', 'Specialized therapy modules']
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input using Zod
    const validation = validateInput(paymentSchema, body)
    if (!validation.success) {
      return handleValidationError(validation.errors)
    }
    
    const { planId, userId } = validation.data

    // Validate plan
    if (!plans[planId]) {
      return Errors.badRequest('Invalid plan selected')
    }

    // For free plan, just return success
    if (planId === 'free') {
      return NextResponse.json({
        success: true,
        message: 'Free plan activated successfully'
      })
    }

    // Create Stripe checkout session for paid plans
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plans[planId].priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/payment/cancelled`,
      client_reference_id: userId,
      metadata: {
        planId: planId
      }
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url
    })
  } catch (error: any) {
    console.error('Payment API error:', error)
    return Errors.internal(error)
  }
}