'use client'

import { useState, useEffect } from 'react'
import { useCart } from './CartContext'
import { X, Plus, Minus, Trash2, ShoppingBag, Tag } from 'lucide-react'

export default function SlideOutCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const shippingCents = 1000
  const subtotal = total
  const discountAmount = subtotal * (discount / 100)
  const totalWithShipping = subtotal - discountAmount + shippingCents / 100

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    
    setIsApplyingCoupon(true)
    // Simulate coupon validation
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'TEST10') {
        setDiscount(10)
      } else if (couponCode.toUpperCase() === 'TEST20') {
        setDiscount(20)
      } else {
        alert('Invalid coupon code. Try TEST10 or TEST20')
      }
      setIsApplyingCoupon(false)
    }, 1000)
  }

  const removeCoupon = () => {
    setCouponCode('')
    setDiscount(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeCart}
        />
        
        {/* Cart Panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-6 bg-gray-50 border-b">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Shopping Cart
                </h2>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 px-4 py-6 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.slug}-${item.size ?? ''}`} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                        <img
                          src={(item.image || '/products/placeholder.png').replace(/ /g, "%20")}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                            {item.size && <span className="text-sm text-gray-500 ml-1">({item.size})</span>}
                          </h3>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.slug, item.size, Math.max(1, item.quantity - 1))}
                              className="p-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}
                              className="p-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItem(item.slug, item.size)}
                              className="p-1 rounded-md text-red-500 hover:bg-red-50 ml-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coupon Section */}
              {items.length > 0 && (
                <div className="px-4 py-4 border-t">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {discount > 0 ? (
                      <button
                        onClick={removeCoupon}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                      >
                        {isApplyingCoupon ? 'Applying...' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      Coupon applied: {discount}% discount
                    </p>
                  )}
                </div>
              )}

              {/* Summary */}
              {items.length > 0 && (
                <div className="px-4 py-4 border-t bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>${(shippingCents / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${totalWithShipping.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              {items.length > 0 && (
                <div className="px-4 py-4 border-t">
                  <button
                    onClick={() => window.location.href = '/checkout'}
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Test mode: Use card 4242 4242 4242 4242
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}