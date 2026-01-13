"use client"

import { SessionProvider } from "next-auth/react"

/**
 * Session provider wrapper component
 * Provides session context to client components
 */
export function AuthSessionProvider({
    children,
}: {
    children: React.ReactNode
})
{
    return <SessionProvider>{children}</SessionProvider>
}
