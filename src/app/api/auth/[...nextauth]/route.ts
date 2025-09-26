import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Create the NextAuth handler with Next.js 15 compatibility
const handler = NextAuth(authOptions)

// Wrap handlers to properly handle Next.js 15 dynamic APIs
async function GET(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  try {
    // Await params to satisfy Next.js 15 requirements
    const params = await context.params
    return handler(request, { params: { nextauth: params.nextauth } })
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return new Response('Authentication error', { status: 500 })
  }
}

async function POST(request: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  try {
    // Await params to satisfy Next.js 15 requirements
    const params = await context.params
    return handler(request, { params: { nextauth: params.nextauth } })
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return new Response('Authentication error', { status: 500 })
  }
}

// Export named handlers for Next.js App Router
export { GET, POST }

// Runtime configuration for Next.js 15 compatibility
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'