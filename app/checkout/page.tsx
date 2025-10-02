'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/components/cart/CartContext'
import StripeProvider from '@/components/StripeProvider'
import CheckoutForm from '@/components/CheckoutForm'
import { ArrowLeft, Lock, CreditCard, Shield } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const shippingCents = 1000
  const totalWithShipping = total + shippingCents / 100
  const totalCents = Math.round(totalWithShipping * 100)

  useEffect(() => {
    if (items.length === 0) {
      window.location.href = '/'
      return
    }

    createPaymentIntent()
  }, [items])

  const createPaymentIntent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalCents,
          currency: 'usd',
          metadata: {
            items: JSON.stringify(items.map(item => ({
              slug: item.slug,
              name: item.name,
              size: item.size || '',
              quantity: item.quantity,
              price: item.price
            })))
          }
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      setClientSecret(data.clientSecret)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up secure payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <CreditCard className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Setup Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to initialize payment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.slug}-${item.size ?? ''}`} className="flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name} {item.size && <span className="text-gray-500">({item.size})</span>}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${(shippingCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${totalWithShipping.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <StripeProvider>
              <CheckoutForm 
                clientSecret={clientSecret}
                totalAmount={totalWithShipping}
                items={items}
              />
            </StripeProvider>
          </div>
        </div>
      </div>
    </div>
  )
}