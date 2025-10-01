'use client'

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

export type CartItem = {
  slug: string
  name: string
  size?: string
  price: number
  image?: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: CartItem) => void
  removeItem: (slug: string, size?: string) => void
  updateQuantity: (slug: string, size: string | undefined, quantity: number) => void
  clear: () => void
  total: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load/persist from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart')
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((v) => !v)

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.slug === item.slug && i.size === item.size)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity }
        return next
      }
      return [...prev, item]
    })
  }

  const removeItem = (slug: string, size?: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)))
  }

  const updateQuantity = (slug: string, size: string | undefined, quantity: number) => {
    setItems((prev) => prev.map((i) => (i.slug === slug && i.size === size ? { ...i, quantity } : i)))
  }

  const clear = () => setItems([])

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    total,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}