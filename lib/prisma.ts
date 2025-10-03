// Try to import PrismaClient, but handle the case where it's not generated
let PrismaClient: any = null

try {
  const prismaModule = require('@prisma/client')
  PrismaClient = prismaModule.PrismaClient
} catch (error) {
  console.warn('Prisma client not available, using mock')
}

// Prevent multiple instances in dev (Next.js hot reload)
const globalForPrisma = globalThis as unknown as {
  prisma: any | undefined
}

export const prisma = PrismaClient
  ? (globalForPrisma.prisma ?? new PrismaClient({ log: ['warn', 'error'] }))
  : null

if (process.env.NODE_ENV !== 'production' && PrismaClient) {
  globalForPrisma.prisma = prisma
}

export default prisma