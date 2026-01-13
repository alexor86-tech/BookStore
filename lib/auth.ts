import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// Validate required environment variables
console.log("[AUTH] Initializing Auth.js configuration...")
console.log("[AUTH] Environment variables check:", {
    hasAUTH_SECRET: !!process.env.AUTH_SECRET,
    hasGOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    hasGOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    hasDATABASE_URL: !!process.env.DATABASE_URL,
})

if (!process.env.AUTH_SECRET)
{
    console.error("[AUTH] ERROR: AUTH_SECRET is not set")
    throw new Error("AUTH_SECRET is not set in environment variables")
}
if (!process.env.GOOGLE_CLIENT_ID)
{
    console.error("[AUTH] ERROR: GOOGLE_CLIENT_ID is not set")
    throw new Error("GOOGLE_CLIENT_ID is not set in environment variables")
}
if (!process.env.GOOGLE_CLIENT_SECRET)
{
    console.error("[AUTH] ERROR: GOOGLE_CLIENT_SECRET is not set")
    throw new Error("GOOGLE_CLIENT_SECRET is not set in environment variables")
}

console.log("[AUTH] All environment variables are set")

/**
 * Configuration for NextAuth.js v5 authentication
 * Uses Google OAuth provider and Prisma adapter for session management
 */
console.log("[AUTH] Creating NextAuth configuration...")

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: prisma ? PrismaAdapter(prisma) as any : undefined,
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "database",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        /**
         * Called when a session is checked
         * In database strategy, user is passed as a parameter
         * @param {Object} params - Session callback parameters
         * @param {Object} params.session - Current session object
         * @param {Object} params.user - User object from database (only in database strategy)
         * @returns {Object} Session object with user data
         */
        async session({ session, user })
        {
            console.log("[AUTH] Session callback called", {
                hasSession: !!session,
                hasUser: !!user,
                userId: user?.id,
                userEmail: user?.email,
            })

            // In database strategy, user is always provided
            if (session?.user && user)
            {
                session.user.id = user.id
            }
            return session
        },
        /**
         * Called when a user signs in
         * @param {Object} params - Sign in callback parameters
         * @param {Object} params.user - User object
         * @param {Object} params.account - Account object
         * @param {Object} params.profile - Profile object from OAuth provider
         */
        async signIn({ user, account, profile })
        {
            console.log("[AUTH] Sign in callback called", {
                userId: user?.id,
                userEmail: user?.email,
                provider: account?.provider,
                accountId: account?.providerAccountId,
            })
            return true
        },
    },
    debug: true,
})
