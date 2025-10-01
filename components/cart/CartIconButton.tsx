'use client'

import { useCart } from './CartContext'

export default function CartIconButton({ className = '' }: { className?: string }) {
  const { items, toggleCart } = useCart()
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  return (
    <button
      aria-label="Open cart"
      onClick={toggleCart}
      className={`relative bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 ${className}`}
    >
      {/* Simple cart glyph */}
      <span className="block w-5 h-5">🛒</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
          {count}
        </span>
      )}
    </button>
  )
}