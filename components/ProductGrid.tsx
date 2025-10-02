'use client'

import { useState, useMemo } from 'react'
import { useCart } from './cart/CartContext'
import { products, categories } from '@/app/data/products'
import { ShoppingCart, Filter, Search, X } from 'lucide-react'

export default function ProductGrid() {
  const { addItem, openCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return 0
      }
    })

    return filtered
  }, [selectedCategory, searchTerm, sortBy])

  const handleQuickAdd = (product: any, size?: string) => {
    const price = size ? product.sizes.find((s: any) => s.size === size)?.price || product.price : product.price
    addItem({
      slug: product.id,
      name: product.name,
      size,
      price,
      image: product.image,
      quantity: 1
    })
    openCart()
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
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-1 aspect-h-1 w-full">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              {/* Sizes */}
              {product.sizes.length > 1 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Available sizes:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map((size) => (
                      <span key={size.size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {size.size} - ${size.price}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.sizes.length > 1 && (
                  <span className="text-sm text-gray-500 ml-2">and more</span>
                )}
              </div>

              {/* Action Buttons */}
              {product.sizes.length > 1 ? (
                <button
                  onClick={() => window.location.href = `/products/${product.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Options
                </button>
              ) : (
                <button
                  onClick={() => handleQuickAdd(product)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Quick Add
                </button>
              )}
            </div>
          </div>
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