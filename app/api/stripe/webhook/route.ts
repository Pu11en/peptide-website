import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { withErrorHandling } from '@/lib/errorHandler'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2025-08-27.basil' }) : null
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export const POST = withErrorHandling(async (req: Request) => {
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  console.log(`Received webhook event: ${event.type}`)

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
      break
    
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
      break
    
    case 'payment_intent.requires_action':
      await handlePaymentRequiresAction(event.data.object as Stripe.PaymentIntent)
      break
    
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as any)
      break
    
    case 'checkout.session.expired':
      await handleCheckoutSessionExpired(event.data.object as any)
      break
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
})

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment succeeded: ${paymentIntent.id}`)
  
  try {
    // Extract items from metadata
    let items: Array<{ slug: string; quantity: number; size?: string }> = []
    if (paymentIntent.metadata?.items) {
      try {
        const parsed = JSON.parse(paymentIntent.metadata.items) as Array<{ slug: string; qty: number; size?: string }>
        items = parsed.map((i) => ({ slug: i.slug, quantity: i.qty, size: i.size }))
      } catch (err) {
        console.error('Failed to parse items metadata:', err)
      }
    }

    // Get customer email
    const email = paymentIntent.receipt_email || 'unknown@example.com'

    // Create order
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
    await fetch(`${siteUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        items,
        metadata: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        }
      }),
    })
  } catch (err) {
    console.error('Error handling payment succeeded:', err)
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment failed: ${paymentIntent.id}`)
  console.log(`Failure reason: ${paymentIntent.last_payment_error?.message}`)
  
  // Here you could:
  // - Notify the customer about the failure
  // - Update order status in your database
  // - Send internal notifications
}

async function handlePaymentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment requires action: ${paymentIntent.id}`)
  // Handle 3D Secure or other authentication requirements
}

async function handleCheckoutSessionCompleted(session: any) {
  console.log(`Checkout session completed: ${session.id}`)
  
  // This handles the legacy checkout flow
  if (session.metadata?.items) {
    try {
      const raw = session.metadata.items
      const parsed = JSON.parse(raw) as Array<{ slug: string; qty: number; size?: string }>
      const items = parsed.map((i) => ({ slug: i.slug, quantity: i.qty, size: i.size }))
      
      const email = session.customer_details?.email || session.customer_email || 'unknown@example.com'
      
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
      await fetch(`${siteUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, items, metadata: { sessionId: session.id } }),
      })
    } catch (err) {
      console.error('Error handling checkout session completed:', err)
    }
  }
}

async function handleCheckoutSessionExpired(session: any) {
  console.log(`Checkout session expired: ${session.id}`)
  // Handle expired checkout sessions
}

export const runtime = 'nodejs'