import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { buffer } from 'micro'
import { Errors } from '@/src/utils/errorHandler'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
})

// Stripe requires the raw body to construct the event
export async function POST(request: Request) {
  try {
    const buf = await buffer(request)
    const sig = request.headers.get('stripe-signature')

    let event

    try {
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return Errors.badRequest('Webhook Error: ' + err.message)
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        // Fulfill the subscription purchase...
        console.log('Checkout session completed for user:', session.client_reference_id)
        break
      case 'customer.subscription.deleted':
        const subscription = event.data.object
        // Handle subscription cancellation...
        console.log('Subscription cancelled for user:', subscription.customer)
        break
      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        // Handle successful payment...
        console.log('Payment succeeded for customer:', invoice.customer)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err.message)
    return Errors.badRequest('Webhook Error: ' + err.message)
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}