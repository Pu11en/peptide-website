import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from './trpc'

export const appRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.product.findMany({
        where: input.category ? { category: input.category } : undefined,
        select: { id: true, slug: true, name: true, priceCents: true, imagePath: true, category: true }
      })
    }),
})

export type AppRouter = typeof appRouter