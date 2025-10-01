import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { withErrorHandling } from '@/lib/errorHandler'

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
    // Use class-level constructEvent; does not require a Stripe secret key
    event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  // Handle only checkout.session.completed for now
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Determine customer email
    const email = session.customer_details?.email || session.customer_email || 'unknown@example.com'

    // Parse items from metadata (set in create-checkout)
    let items: Array<{ slug: string; quantity: number; size?: string }> = []
    try {
      const raw = (session.metadata?.items as string) || '[]'
      const parsed = JSON.parse(raw) as Array<{ slug: string; qty: number; size?: string }>
      items = parsed.map((i) => ({ slug: i.slug, quantity: i.qty, size: i.size }))
    } catch {
      items = []
    }

    // Persist order via internal orders API (reuses pricing logic and n8n trigger)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
    try {
      await fetch(`${siteUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, items, metadata: { sessionId: session.id } }),
      })
    } catch (err) {
      // Log and continue; webhook should still return 200 to avoid retries storms if the local persistence fails
      console.error('Order persistence error', err)
    }
  }

  return NextResponse.json({ received: true })
})

export const runtime = 'nodejs'