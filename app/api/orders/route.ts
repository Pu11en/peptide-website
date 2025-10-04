import { NextResponse } from 'next/server'
import { z } from 'zod'
import { withErrorHandling } from '@/lib/errorHandler'

// Zod schema for incoming order payload
const OrderSchema = z.object({
  email: z.string().email(),
  items: z
    .array(
      z.object({
        slug: z.string(),
        quantity: z.number().int().min(1),
        size: z.string().optional(),
      })
    )
    .min(1),
  metadata: z.record(z.any()).optional(),
})

// Create an order, persist to Prisma if available, and fire-and-forget n8n webhook
export const POST = withErrorHandling(async (req: Request) => {
    const json = await req.json()
    const parsed = OrderSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, items, metadata } = parsed.data

    // Use static product list from app/data/products.ts
    const { products } = await import('@/app/data/products')
    const map = new Map(products.map((p) => [p.id, p]))
    
    let totalCents = 0
    const orderItems: Array<{
      quantity: number
      priceCents: number
      slug: string
      size?: string
    }> = []

    for (const item of items) {
      const p = map.get(item.slug)
      if (!p) {
        return NextResponse.json({ error: `Unknown product: ${item.slug}` }, { status: 400 })
      }
      let price = p.price
      if (item.size) {
        const found = p.sizes.find((s) => s.size === item.size)
        price = found?.price ?? p.price
      }
      const priceCents = Math.round(price * 100)
      totalCents += priceCents * item.quantity
      orderItems.push({
        quantity: item.quantity,
        priceCents,
        slug: item.slug,
        size: item.size
      })
    }

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const status: 'PENDING' | 'PAID' | 'CANCELLED' | 'FULFILLED' = 'PENDING'
    const persisted = false

    // Non-blocking n8n webhook trigger
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (n8nUrl) {
      const payload = { orderId, email, items: orderItems, totalCents, status, persisted, metadata }
      fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }).catch((err) => {
        console.error('n8n webhook error', err)
      })
    }

    return NextResponse.json({ success: true, orderId, totalCents, status, persisted })
})

export const runtime = 'nodejs'