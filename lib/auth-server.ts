import { auth } from "@/lib/auth"

/**
 * Get server-side session
 * Use this function in Server Components and API routes
 * @returns {Promise<Session | null>} Session object or null if not authenticated
 */
export async function getSession()
{
    return await auth()
}

/**
 * Get current user from session
 * @returns {Promise<{id: string, email: string, name: string | null, image: string | null} | null>} User object or null if not authenticated
 */
export async function getCurrentUser()
{
    const session = await getSession()
    return session?.user ? {
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
    } : null
}

/**
 * Require authentication
 * Throws error if user is not authenticated
 * @returns {Promise<{id: string, email: string, name: string | null, image: string | null}>} User object
 * @throws {Error} If user is not authenticated
 */
export async function requireAuth()
{
    const user = await getCurrentUser()
    if (!user)
    {
        throw new Error("Unauthorized")
    }
    return user
}
