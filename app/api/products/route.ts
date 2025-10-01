import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/products – minimal, selective fields for performance
export async function GET() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, priceCents: true, imagePath: true }
  })

  return NextResponse.json({ products })
}