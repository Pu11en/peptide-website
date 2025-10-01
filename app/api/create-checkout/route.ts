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

const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }),
}).optional()

export const POST = withErrorHandling(async (req: Request) => {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const body = await req.json()
  const parsedItems = ItemsSchema.safeParse(body.items)
  const parsedCustomer = CustomerSchema.safeParse(body.customer)
  const shippingCents = typeof body.shippingCents === 'number' ? body.shippingCents : 1000

  if (!parsedItems.success) {
    return NextResponse.json(
      { error: 'Invalid items payload', issues: parsedItems.error.flatten() },
      { status: 400 }
    )
  }
  if (body.customer && !parsedCustomer.success) {
    return NextResponse.json(
      { error: 'Invalid customer payload', issues: parsedCustomer.error.flatten() },
      { status: 400 }
    )
  }

  const items = parsedItems.data
  const customer = parsedCustomer.success ? parsedCustomer.data : undefined
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

    // Append flat shipping as a line item
    const shippingLineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: shippingCents,
        product_data: {
          name: 'Flat Shipping',
        },
      },
    }
    line_items.push(shippingLineItem)

    const siteUrl =
      req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?canceled=1`,
      metadata: {
        items: JSON.stringify(items.map((i) => ({ slug: i.slug, qty: i.quantity, size: i.size ?? '' }))),
        customerEmail: customer?.email || '',
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