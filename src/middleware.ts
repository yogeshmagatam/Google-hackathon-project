import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Handle NextAuth routes with proper async API support
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    // Add necessary headers for NextAuth compatibility with Next.js 15
    const response = NextResponse.next()
    
    // Add headers to prevent caching issues with dynamic APIs
    response.headers.set('x-middleware-cache', 'no-cache')
    response.headers.set('cache-control', 'no-cache, no-store, must-revalidate')
    
    // Add CORS headers for auth endpoints
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}