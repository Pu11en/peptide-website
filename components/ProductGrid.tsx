'use client'

import { useState, useMemo } from 'react'
import { useCart } from './cart/CartContext'
import { products, categories } from '@/app/data/products'
import { normalizeProduct, getRenderableProducts, ProductFilters } from '@/lib/productUtils'
import ProductCard from './ProductCard'
import { ShoppingCart, Filter, Search, X } from 'lucide-react'

export default function ProductGrid() {
  const { addItem, openCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const normalizedProducts = useMemo(() => {
    // First filter out invalid products
    const validProducts = getRenderableProducts(products)
    return validProducts.map(normalizeProduct)
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = normalizedProducts

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'price-low':
          // Find the lowest price for each product
          const minPriceA = Math.min(...a.variants.map(v => v.price))
          const minPriceB = Math.min(...b.variants.map(v => v.price))
          return minPriceA - minPriceB
        case 'price-high':
          // Find the highest price for each product
          const maxPriceA = Math.max(...a.variants.map(v => v.price))
          const maxPriceB = Math.max(...b.variants.map(v => v.price))
          return maxPriceB - maxPriceA
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, searchTerm, sortBy, normalizedProducts])

  const handleQuickAdd = (product: any, size?: string) => {
    const originalProduct = products.find(p => p.id === product.id)
    const price = size ? originalProduct?.sizes.find((s: any) => s.size === size)?.price || originalProduct?.price : originalProduct?.price
    
    if (originalProduct) {
      addItem({
        slug: originalProduct.id,
        name: originalProduct.name,
        size,
        price: price || 0,
        image: originalProduct.image,
        quantity: 1
      })
      openCart()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Peptides</h1>
        <p className="text-gray-600">High-quality research compounds for scientific study</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle (Mobile) */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {isFilterOpen && (
          <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickAdd={(productId, variant) => handleQuickAdd(products.find(p => p.id === productId), variant)}
            onViewOptions={(productId) => window.location.href = `/products/${productId}`}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}