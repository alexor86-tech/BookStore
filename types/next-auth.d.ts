import "next-auth"
import "next-auth/jwt"

/**
 * Type declarations for NextAuth.js
 * Extends default session and JWT types to include user id
 */
declare module "next-auth"
{
    interface Session
    {
        user: {
            id: string
            email: string
            name?: string | null
            image?: string | null
        }
    }

    interface User
    {
        id: string
    }
}

declare module "next-auth/jwt"
{
    interface JWT
    {
        id: string
    }
}
