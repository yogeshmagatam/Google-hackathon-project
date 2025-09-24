import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest } from 'next/server'

/**
 * Helper function to get authenticated session in Next.js 15 App Router
 * Simplified to avoid dynamic API issues with NextAuth v4
 */
export async function getAuthenticatedSession(request?: NextRequest) {
  try {
    // Direct call to getServerSession - NextAuth should handle context internally
    const session = await getServerSession(authOptions)
    
    return session
  } catch (error) {
    // Log error for debugging but don't expose sensitive information
    console.error('Error getting authenticated session:', error)
    
    // Return null for any authentication errors
    return null
  }
}

/**
 * Middleware-style helper to check authentication
 * Enhanced with Next.js 15 compatibility
 */
export async function requireAuth(request?: NextRequest) {
  try {
    const session = await getAuthenticatedSession(request)
    
    if (!session?.user?.email) {
      return {
        error: 'Unauthorized',
        status: 401,
        session: null
      }
    }
    
    return {
      error: null,
      status: 200,
      session
    }
  } catch (error) {
    console.error('Error in requireAuth:', error)
    
    return {
      error: 'Authentication service error',
      status: 500,
      session: null
    }
  }
}

/**
 * Safe wrapper for getting user ID from session
 */
export async function getCurrentUserId(request?: NextRequest): Promise<string | null> {
  try {
    const session = await getAuthenticatedSession(request)
    return session?.user?.id || null
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}