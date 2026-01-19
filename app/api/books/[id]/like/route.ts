import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/books/[id]/like
 * Toggle like for a public book
 * Protected route - requires authentication
 * Only public books can be liked
 * @param {NextRequest} request - Request object
 * @param {Object} params - Route parameters
 * @param {string} params.id - Book ID
 * @returns {Promise<NextResponse>} Response with liked status and likes count
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        const user = await requireAuth()
        const bookId = params.id

        // Check if book exists and is public
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        })

        if (!book)
        {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            )
        }

        if (!book.isPublic)
        {
            return NextResponse.json(
                { error: "Only public books can be liked" },
                { status: 403 }
            )
        }

        // Check if like already exists
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_bookId: {
                    userId: user.id,
                    bookId: bookId,
                },
            },
        })

        let liked: boolean

        if (existingLike)
        {
            // Remove like
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            })
            liked = false
        }
        else
        {
            // Create like
            await prisma.like.create({
                data: {
                    userId: user.id,
                    bookId: bookId,
                },
            })
            liked = true
        }

        // Get updated likes count
        const likesCount = await prisma.like.count({
            where: { bookId },
        })

        return NextResponse.json({
            liked,
            likesCount,
        })
    }
    catch (error: any)
    {
        // Handle unique constraint violation (shouldn't happen due to check, but just in case)
        if (error.code === "P2002")
        {
            return NextResponse.json(
                { error: "Like already exists" },
                { status: 409 }
            )
        }

        console.error("Error toggling like:", error)
        return NextResponse.json(
            { error: "Failed to toggle like. Please try again later." },
            { status: 500 }
        )
    }
}
