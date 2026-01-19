"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

/**
 * Sign out button component
 * Logs out the current user
 */
export function SignOutButton()
{
    const handleSignOut = () =>
    {
        signOut({ callbackUrl: "/login" })
    }

    return (
        <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
        >
            Выйти
        </Button>
    )
}
