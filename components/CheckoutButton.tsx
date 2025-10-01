'use client'

import { useState } from 'react'

type Item = { slug: string; quantity: number; size?: string }

export default function CheckoutButton({ items, label = 'Checkout' }: { items: Item[]; label?: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to create checkout session')
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Missing checkout URL')
      }
    } catch (e: any) {
      setError(e.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
      >
        {loading ? 'Processing…' : label}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}