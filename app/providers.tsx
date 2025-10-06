'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { CartProvider } from '@/components/cart/CartContext'
import CartModal from '@/components/cart/CartModal'
import CartIconButton from '@/components/cart/CartIconButton'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <CartProvider>
        {children}
        {/* Floating cart, fixed bottom-right on all screens */}
        <div className="fixed bottom-4 right-4 z-50">
          <CartIconButton />
        </div>
        <CartModal />
      </CartProvider>
    </ThemeProvider>
  )
}