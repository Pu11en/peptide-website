'use client'

import { NormalizedProduct } from '@/lib/productUtils'
import { getPriceDisplay } from '@/lib/productUtils'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: NormalizedProduct
  onQuickAdd?: (productId: string, variant?: string) => void
  onViewOptions?: (productId: string) => void
}

export default function ProductCard({
  product,
  onQuickAdd,
  onViewOptions
}: ProductCardProps) {
  const priceDisplay = getPriceDisplay(product.variants)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
      {/* Product Image */}
      <div className="w-full h-48 flex items-center justify-center bg-gray-50">
        <img
          src={product.image.replace(/ /g, "%20")}
          alt={product.title}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Card Content */}
      <div className="p-4 h-64 flex flex-col">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">
          {product.description}
        </p>

        {/* Price Block */}
        <div className="mb-4">
          <span className="text-lg font-bold text-blue-600">
            {priceDisplay}
          </span>
        </div>

        {/* CTA Row */}
        <button
          onClick={() => {
            if (product.variants.length > 1) {
              onViewOptions?.(product.id)
            } else {
              onQuickAdd?.(product.id, product.variants[0].size)
            }
          }}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {product.variants.length > 1 ? 'View Options' : 'Quick Add'}
        </button>
      </div>
    </div>
  )
}