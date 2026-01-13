import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware for protecting routes
 * Redirects unauthenticated users to /login
 * Note: This runs in Edge Runtime, so we can't use Prisma directly
 * We check for session cookie instead
 */
export async function middleware(request: NextRequest)
{
    const pathname = request.nextUrl.pathname

    // Check if route requires authentication
    const isProtectedRoute = pathname.startsWith("/dashboard") ||
        pathname.startsWith("/my-prompts")

    if (isProtectedRoute)
    {
        // Check for session cookie (database sessions are stored in cookies)
        const hasSessionCookie = request.cookies.has("authjs.session-token") ||
            request.cookies.has("__Secure-authjs.session-token") ||
            request.cookies.has("next-auth.session-token") ||
            request.cookies.has("__Secure-next-auth.session-token")

        if (!hasSessionCookie)
        {
            const loginUrl = new URL("/login", request.url)
            loginUrl.searchParams.set("callbackUrl", pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

/**
 * Protected routes configuration
 * All routes matching these patterns require authentication
 */
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/my-prompts/:path*",
    ],
}
