import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { withErrorHandling } from '@/lib/errorHandler'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-09-30.acacia' }) : null

export const GET = withErrorHandling(async (req: Request) => {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })
  }

  try {
    // Retrieve the checkout session with expanded details
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    })

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ 
        success: false, 
        status: session.payment_status 
      })
    }

    // Parse metadata
    const items = session.metadata?.items ? JSON.parse(session.metadata.items) : []
    const shippingAddress = session.metadata?.shippingAddress 
      ? JSON.parse(session.metadata.shippingAddress) 
      : null

    // Prepare order data
    const orderData = {
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      customerEmail: session.customer_details?.email || session.metadata?.customerEmail || '',
      customerName: session.customer_details?.name || session.metadata?.customerName || '',
      customerPhone: session.customer_details?.phone || session.metadata?.customerPhone || '',
      amountTotal: session.amount_total || 0, // in cents
      amountSubtotal: session.amount_subtotal || 0,
      currency: session.currency || 'usd',
      paymentStatus: session.payment_status,
      items,
      shippingAddress,
      billingAddress: session.customer_details?.address || null,
    }

    // TODO: Save order to your database
    // Example:
    // const order = await prisma.order.create({
    //   data: {
    //     stripeSessionId: orderData.stripeSessionId,
    //     stripePaymentIntentId: orderData.stripePaymentIntentId,
    //     customerEmail: orderData.customerEmail,
    //     customerName: orderData.customerName,
    //     totalAmount: orderData.amountTotal,
    //     status: 'completed',
    //     items: {
    //       create: items.map((item: any) => ({
    //         slug: item.slug,
    //         quantity: item.qty,
    //         size: item.size,
    //       }))
    //     }
    //   }
    // })

    console.log('✅ Order verified and ready to save:', orderData)

    // Return success with order details
    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: orderData.customerEmail,
        customer_name: orderData.customerName,
        payment_status: session.payment_status,
      },
      order: orderData,
    })

  } catch (error: any) {
    console.error('❌ Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
})

export const runtime = 'nodejs'
