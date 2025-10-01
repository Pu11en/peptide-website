'use client'

import { useState } from 'react'
import { useCart } from './CartContext'

type Customer = {
  name: string
  email: string
  phone: string
  address: { street: string; city: string; state: string; zip: string; country: string }
}

export default function CheckoutCartButton({
  className = '',
  customer,
  shippingCents = 1000,
}: {
  className?: string
  customer?: Customer
  shippingCents?: number
}) {
  const { items } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const payload = {
        items: items.map((i) => ({ slug: i.slug, quantity: i.quantity, size: i.size })),
        customer,
        shippingCents,
      }
      // Save last order for success page webhook handoff
      try {
        localStorage.setItem('lastOrder', JSON.stringify({ customer, cart: payload.items }))
      } catch {}
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (data.url) window.location.href = data.url
    } catch (e: any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      disabled={items.length === 0 || loading}
      onClick={handleCheckout}
      className={className || 'bg-blue-600 hover:bg-blue-700 text-white rounded py-2 px-4 disabled:opacity-50'}
    >
      {loading ? 'Redirecting…' : 'Buy Now'}
      {error && <span className="ml-2 text-red-400 text-xs">{error}</span>}
    </button>
  )
}