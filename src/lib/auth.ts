import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { Adapter } from 'next-auth/adapters'

// Check if OAuth providers are configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
                          process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id'

const isGitHubConfigured = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET && 
                          process.env.GITHUB_CLIENT_ID !== 'your-github-client-id'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  debug: process.env.NODE_ENV === 'development',
  providers: [
    // Only include OAuth providers if properly configured
    ...(isGoogleConfigured ? [GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })] : []),
    ...(isGitHubConfigured ? [GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })] : []),
    // Demo credentials provider for development
    CredentialsProvider({
      id: 'demo',
      name: 'Demo User',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@example.com" },
        name: { label: "Name", type: "text", placeholder: "Demo User" }
      },
      async authorize(credentials) {
        // For demo purposes - always allow with default values if not provided
        const email = credentials?.email || 'demo@example.com'
        const name = credentials?.name || 'Demo User'
        
        try {
          // Try to find existing user
          let user = await prisma.user.findUnique({
            where: { email }
          })

          // Create user if doesn't exist
          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name,
              }
            })
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Demo auth error:', error)
          // Fallback for demo - return a valid user object
          return {
            id: `demo-${Date.now()}`,
            email,
            name,
          }
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Always allow demo sign in
      if (account?.provider === 'demo') {
        return true
      }
      return true
    },
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ user, token, account }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
  },
}