import { NextResponse } from 'next/server'
import { products } from '../../data/products'

// GET /api/products – return static product data
export async function GET() {
  try {
    // Return static product data instead of querying database
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error loading products:', error)
    // Return empty array as fallback
    return NextResponse.json({ products: [] })
  }
}