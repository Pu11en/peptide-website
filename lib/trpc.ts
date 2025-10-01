import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@/server/api/root'

export const trpc = createTRPCReact<AppRouter>()

export function createClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: typeof window === 'undefined' ? 'http://localhost:3000/api/trpc' : '/api/trpc',
      }),
    ],
  })
}