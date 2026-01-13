import { handlers } from "@/lib/auth"
import { NextRequest } from "next/server"

/**
 * Auth API route handler with error logging
 */
export async function GET(request: NextRequest)
{
    console.log("[AUTH] GET request:", {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
    })

    try
    {
        const handler = handlers.GET
        return await handler(request)
    }
    catch (error)
    {
        console.error("[AUTH] GET handler error:", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        })
        throw error
    }
}

export async function POST(request: NextRequest)
{
    console.log("[AUTH] POST request:", {
        url: request.url,
        method: request.method,
    })

    try
    {
        const handler = handlers.POST
        return await handler(request)
    }
    catch (error)
    {
        console.error("[AUTH] POST handler error:", {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        })
        throw error
    }
}
