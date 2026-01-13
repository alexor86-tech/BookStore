"use client"

import { signOut } from "next-auth/react"

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
        <button
            onClick={handleSignOut}
            style={{
                padding: "0.5rem 1rem",
                fontSize: "0.9rem",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b91c1c"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626"
            }}
        >
            Выйти
        </button>
    )
}
