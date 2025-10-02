import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import { withErrorHandling } from '@/lib/errorHandler'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2025-08-27.basil' }) : null

const PaymentIntentSchema = z.object({
  amount: z.number().min(50), // Minimum 50 cents
  currency: z.string().default('usd'),
  metadata: z.record(z.string(), z.string()).optional(),
})

export const POST = withErrorHandling(async (req: Request) => {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await req.json()
  const parsed = PaymentIntentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payment intent data', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { amount, currency, metadata } = parsed.data

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: metadata as Record<string, string>,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
})

export const runtime = 'nodejs'