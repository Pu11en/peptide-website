'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartContext'
import { Check, Package, Truck, Mail, ArrowRight } from 'lucide-react'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
  const payment_intent = searchParams?.get('payment_intent')
  const { clear } = useCart()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId || payment_intent) {
      // Clear cart on successful payment
      clear()
      
      // Simulate order details retrieval
      setTimeout(() => {
        setOrderDetails({
          id: sessionId || payment_intent,
          status: 'confirmed',
          email: 'customer@example.com',
          items: [
            { name: 'Sample Product', quantity: 1, price: 99.99 }
          ],
          total: 109.99,
          estimatedDelivery: '3-5 business days'
        })
        setLoading(false)
      }, 1500)
    }
  }, [sessionId, payment_intent, clear])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3">
                <Check className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">Thank you for your order. Your payment has been processed.</p>
            {sessionId && (
              <p className="text-sm text-green-200 mt-2">Order ID: {sessionId.slice(0, 8)}...</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Details
              </h2>
              
              {orderDetails && (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Order Number</span>
                      <span className="font-medium">{orderDetails.id?.slice(0, 12) || 'TEST-ORDER'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {orderDetails.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Email</span>
                      <span className="font-medium">{orderDetails.email}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Items Ordered</h3>
                    <div className="space-y-2">
                      {orderDetails.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Subtotal</span>
                      <span>${(orderDetails.total - 10).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Shipping</span>
                      <span>$10.00</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">{orderDetails?.estimatedDelivery || '3-5 business days'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Confirmation</p>
                    <p className="text-sm text-gray-600">A confirmation email has been sent to your email address.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order Processing</p>
                    <p className="text-sm text-gray-600">Your order is being processed and will be shipped soon.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Shipping</p>
                    <p className="text-sm text-gray-600">You'll receive tracking information once shipped.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Delivery</p>
                    <p className="text-sm text-gray-600">Your order will arrive within the estimated timeframe.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Link
                  href="/"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}