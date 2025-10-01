import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
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

    // Try to price via Prisma products; fallback to static app/data/products.ts if DB not configured
    const slugs = items.map((i) => i.slug)
    let usingDb = false
    let dbProducts: Array<{ id: number; slug: string; priceCents: number }> = []

    if (process.env.DATABASE_URL) {
      try {
        dbProducts = await prisma.product.findMany({
          where: { slug: { in: slugs } },
          select: { id: true, slug: true, priceCents: true },
        })
        usingDb = dbProducts.length === items.length
      } catch (err) {
        usingDb = false
      }
    }

    let totalCents = 0
    const orderItemsForCreate: Array<{
      productId?: number
      quantity: number
      priceCents: number
      slug: string
    }> = []

    if (usingDb) {
      const map = new Map(dbProducts.map((p) => [p.slug, p]))
      for (const item of items) {
        const p = map.get(item.slug)
        if (!p) {
          return NextResponse.json({ error: `Unknown product: ${item.slug}` }, { status: 400 })
        }
        const pricePer = p.priceCents
        totalCents += pricePer * item.quantity
        orderItemsForCreate.push({ productId: p.id, quantity: item.quantity, priceCents: pricePer, slug: item.slug })
      }
    } else {
      // Fallback to static product list
      const { products } = await import('@/app/data/products')
      const map = new Map(products.map((p) => [p.id, p]))

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
        orderItemsForCreate.push({ quantity: item.quantity, priceCents, slug: item.slug })
      }
    }

    let orderId: string | undefined
    let status: 'PENDING' | 'PAID' | 'CANCELLED' | 'FULFILLED' = 'PENDING'
    let persisted = false

    if (usingDb) {
      const created = await prisma.order.create({
        data: {
          email,
          totalCents,
          status: 'PENDING',
          items: {
            create: orderItemsForCreate.map((oi) => ({
              productId: oi.productId!,
              quantity: oi.quantity,
              priceCents: oi.priceCents,
            })),
          },
        },
        select: { id: true },
      })
      orderId = created.id
      persisted = true
    }

    // Non-blocking n8n webhook trigger
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (n8nUrl) {
      const payload = { orderId, email, items, totalCents, status, persisted, metadata }
      fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }).catch((err) => {
        console.error('n8n webhook error', err)
      })
    }

    return NextResponse.json({ success: true, orderId, totalCents, status, persisted, usingDb })
})

export const runtime = 'nodejs'