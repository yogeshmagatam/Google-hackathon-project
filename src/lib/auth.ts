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
  adapter: PrismaAdapter(prisma) as Adapter,
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
        // For demo purposes - create or find user in database
        if (credentials?.email) {
          try {
            // Try to find existing user
            let user = await prisma.user.findUnique({
              where: { email: credentials.email }
            })

            // Create user if doesn't exist
            if (!user) {
              user = await prisma.user.create({
                data: {
                  email: credentials.email,
                  name: credentials.name || 'Demo User',
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
            // Fallback for demo
            return {
              id: `demo-${Date.now()}`,
              email: credentials.email,
              name: credentials.name || 'Demo User',
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
}