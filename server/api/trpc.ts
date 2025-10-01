import { initTRPC } from '@trpc/server'
import type { PrismaClient } from '@prisma/client'
import prisma from '@/lib/prisma'

export type Context = {
  prisma: PrismaClient
}

export function createContext(): Context {
  return { prisma }
}

const t = initTRPC.context<Context>().create()

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure