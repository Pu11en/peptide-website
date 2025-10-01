import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { withErrorHandling } from '@/lib/errorHandler'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-09-30.acacia' }) : null

const ItemsSchema = z.array(
  z.object({
    slug: z.string(),
    quantity: z.number().int().min(1),
    size: z.string().optional(),
  })
)

export const POST = withErrorHandling(async (req: Request) => {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const body = await req.json()
    const parsed = ItemsSchema.safeParse(body.items)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid items payload', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const items = parsed.data
    const slugs = items.map((i) => i.slug)

    // Try database products first
    let usingDb = false
    let dbProducts: Array<{ id: number; slug: string; name: string; priceCents: number; imagePath: string | null }> = []
    if (process.env.DATABASE_URL) {
      try {
        dbProducts = await prisma.product.findMany({
          where: { slug: { in: slugs } },
          select: { id: true, slug: true, name: true, priceCents: true, imagePath: true },
        })
        usingDb = dbProducts.length === items.length
      } catch {
        usingDb = false
      }
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (usingDb) {
      const map = new Map(dbProducts.map((p) => [p.slug, p]))
      for (const item of items) {
        const p = map.get(item.slug)
        if (!p) {
          return NextResponse.json({ error: `Unknown product: ${item.slug}` }, { status: 400 })
        }
        line_items.push({
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: p.priceCents,
            product_data: {
              name: p.name,
              images: p.imagePath ? [absoluteImageUrl(p.imagePath)] : undefined,
              metadata: { slug: item.slug, size: item.size ?? '' },
            },
          },
        })
      }
    } else {
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
        const unit_amount = Math.round(price * 100)
        line_items.push({
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount,
            product_data: {
              name: p.name,
              images: p.image ? [absoluteImageUrl(p.image)] : undefined,
              metadata: { slug: item.slug, size: item.size ?? '' },
            },
          },
        })
      }
    }

    const siteUrl =
      req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?canceled=1`,
      metadata: {
        items: JSON.stringify(items.map((i) => ({ slug: i.slug, qty: i.quantity, size: i.size ?? '' }))),
      },
    })

    return NextResponse.json({ url: session.url })
})

function absoluteImageUrl(path: string) {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  return `${base}${path}`
}

export const runtime = 'nodejs'