import { initTRPC } from '@trpc/server'
import type { PrismaClient } from '@prisma/client'
import prisma from '@/lib/prisma'

export type Context = {
  prisma: PrismaClient | null
}

export function createContext(): Context {
  // Return null prisma for static data deployment
  // Only connect to database if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    return { prisma }
  }
  return { prisma: null }
}

const t = initTRPC.context<Context>().create()

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure