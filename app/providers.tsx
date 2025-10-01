'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc, createClient } from '@/lib/trpc'
import { CartProvider } from '@/components/cart/CartContext'
import CartModal from '@/components/cart/CartModal'
import CartIconButton from '@/components/cart/CartIconButton'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [client] = useState(() => createClient())
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <trpc.Provider client={client} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            {children}
            {/* Floating cart, fixed bottom-right on all screens */}
            <div className="fixed bottom-4 right-4 z-50">
              <CartIconButton />
            </div>
            <CartModal />
          </CartProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ThemeProvider>
  )
}