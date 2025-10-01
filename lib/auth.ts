import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Minimal demo-only auth: accept a single demo user
        if (
          credentials?.email === 'admin@example.com' &&
          credentials?.password === 'demo'
        ) {
          return { id: '1', name: 'Admin', email: 'admin@example.com' }
        }
        return null
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}