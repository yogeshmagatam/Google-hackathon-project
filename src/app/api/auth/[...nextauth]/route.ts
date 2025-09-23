import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Create the NextAuth handler
const handler = NextAuth(authOptions)

// Export named handlers for Next.js App Router
export { handler as GET, handler as POST }

// Runtime configuration for Next.js 15 compatibility
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'