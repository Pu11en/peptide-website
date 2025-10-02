'use client'

import Link from 'next/link'
import { useCart } from '@/components/cart/CartContext'
import { X, ArrowLeft, ShoppingCart } from 'lucide-react'

export default function CanceledPage() {
  const { items } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Cancellation Message */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <X className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment Canceled</h1>
            <p className="text-gray-600 mb-6">
              Your payment has been canceled. No charges were made to your account.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              If you changed your mind or encountered an issue, you can try again or contact our support team for assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </Link>
              {items.length > 0 && (
                <Link
                  href="/checkout"
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Try Checkout Again
                </Link>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Why was my payment canceled?</h3>
                <p className="text-sm text-gray-600">
                  Payments can be canceled for various reasons including user cancellation, network issues, or security checks.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Was I charged?</h3>
                <p className="text-sm text-gray-600">
                  No. When a payment is canceled, no charges are made to your account.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Can I try again?</h3>
                <p className="text-sm text-gray-600">
                  Yes! You can try the checkout process again. Your cart items are still saved.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Still having trouble?</h3>
                <p className="text-sm text-gray-600">
                  Contact our support team and we'll be happy to help you complete your order.
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}