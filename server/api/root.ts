import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from './trpc'
import { products } from '@/app/data/products'

export const appRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      try {
        // Use static data if no database connection
        if (!ctx.prisma) {
          const filteredProducts = input.category
            ? products.filter(p => p.category === input.category)
            : products
          
          return filteredProducts.map(p => ({
            id: p.id,
            slug: p.id, // Using id as slug for now
            name: p.name,
            priceCents: p.price * 100, // Convert to cents
            imagePath: p.image,
            category: p.category
          }))
        }
        
        // Use database if available
        return ctx.prisma.product.findMany({
          where: input.category ? { category: input.category } : undefined,
          select: { id: true, slug: true, name: true, priceCents: true, imagePath: true, category: true }
        })
      } catch (error) {
        console.error('Database error:', error)
        return []
      }
    }),
})

export type AppRouter = typeof appRouter