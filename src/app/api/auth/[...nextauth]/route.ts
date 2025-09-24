import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Create the NextAuth handler with Next.js 15 compatibility
const handler = NextAuth(authOptions)

// Wrap handlers to properly handle Next.js 15 dynamic APIs
async function GET(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  // Await params to satisfy Next.js 15 requirements
  const params = await context.params
  return handler(request, { params: { nextauth: params.nextauth } })
}

async function POST(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  // Await params to satisfy Next.js 15 requirements
  const params = await context.params
  return handler(request, { params: { nextauth: params.nextauth } })
}

// Export named handlers for Next.js App Router
export { GET, POST }

// Runtime configuration for Next.js 15 compatibility
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'