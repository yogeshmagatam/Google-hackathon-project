'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getProviders, ClientSafeProvider } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Github, Mail, User, AlertCircle } from 'lucide-react'

function SignInContent() {
  const [email, setEmail] = useState('demo@example.com')
  const [name, setName] = useState('Demo User')
  const [isLoading, setIsLoading] = useState(false)
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders()
      setProviders(res)
    }
    fetchProviders()

    // Check for errors in URL params (guard for null)
    const errorParam = searchParams?.get?.('error') ?? null
    if (errorParam) {
      setError('Authentication failed. Please try again.')
    }
  }, [searchParams])

  const handleDemoSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await signIn('demo', {
        email,
        name,
        redirect: false,
      })
      
      if (result?.ok) {
        router.push('/')
      } else {
        setError('Demo sign in failed. Please try again.')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An error occurred during sign in.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (providerId: string) => {
    setIsLoading(true)
    setError(null)
    
    // Check if provider is actually available
    if (!providers || !providers[providerId]) {
      setError(`${providerId} provider is not configured. Please use the demo login or configure OAuth credentials.`)
      setIsLoading(false)
      return
    }
    
    try {
      const result = await signIn(providerId, { 
        callbackUrl: '/',
        redirect: false
      })
      
      if (result?.ok) {
        router.push('/')
      } else if (result?.error) {
        setError(`${providerId} sign in failed: ${result.error}`)
      }
    } catch (error) {
      console.error('OAuth sign in error:', error)
      setError(`${providerId} sign in failed. Please try again or use demo login.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to AI Career Advisor</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Demo Sign In Form */}
          <form onSubmit={handleDemoSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              <User className="w-4 h-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Continue as Demo User'}
            </button>
          </form>

          {providers && Object.keys(providers).length > 1 && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* OAuth Providers */}
              <div className="space-y-3">
                {/* Always show Google button for testing */}
                <button
                  type="button"
                  className="w-full border border-black bg-gray-100 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  style={{
                    color: '#000000',
                    backgroundColor: 'gray-100'
                  } as React.CSSProperties}
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isLoading}
                >
                  <Mail className="w-4 h-4 mr-2" style={{ color: '#000000' }} />
                  <span style={{ 
                    color: '#000000', 
                    fontWeight: '500',
                    display: 'inline-block'
                  }}>Continue with Google</span>
                </button>
                
                {providers?.github && (
                  <button
                    type="button"
                    className="w-full border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={isLoading}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Continue with GitHub
                  </button>
                )}
                
                {providers.github && (
                  <button
                    type="button"
                    className="w-full border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={isLoading}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Continue with GitHub
                  </button>
                )}
              </div>
            </>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              For demo purposes, use the demo user option above.
            </p>
            {(!providers || Object.keys(providers).length <= 1) && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border">
                OAuth providers require proper configuration in environment variables.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}