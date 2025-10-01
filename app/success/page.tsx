'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartContext'

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams?.session_id
  const { clear } = useCart()
  const [posted, setPosted] = useState(false)

  useEffect(() => {
    async function postWebhook() {
      try {
        const raw = localStorage.getItem('lastOrder')
        if (!raw) return
        const payload = JSON.parse(raw)
        payload.stripeConfirmed = true
        await fetch('https://drewp.app.n8n.cloud/webhook/e2740d1b-3555-4247-a46d-717639f7de0c', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        localStorage.removeItem('lastOrder')
        clear()
        setPosted(true)
      } catch {
        // Ignore errors; show success UI anyway
      }
    }
    postWebhook()
  }, [clear])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
          <p className="text-gray-700 mb-6">
            Thank you for your purchase. Your payment has been processed.
          </p>
          {sessionId && (
            <p className="text-sm text-gray-600 mb-6">Stripe session: {sessionId}</p>
          )}
          {posted ? (
            <p className="text-green-600 text-sm mb-4">Order recorded. Check your email for details.</p>
          ) : (
            <p className="text-gray-500 text-sm mb-4">Finalizing order…</p>
          )}
          <Link href="/" className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}