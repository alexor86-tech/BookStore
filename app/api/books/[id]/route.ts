import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/books/[id]
 * Get a specific book
 * Protected route - requires authentication
 * Only owner can access private books
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        const user = await requireAuth()
        const bookId = params.id

        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: {
                category: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        })

        if (!book)
        {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            )
        }

        // Check access: owner can access, others can only access public books
        if (book.visibility === "PRIVATE" && book.ownerId !== user.id)
        {
            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
            )
        }

        return NextResponse.json({ book })
    }
    catch (error)
    {
        console.error("Error fetching book:", error)
        return NextResponse.json(
            { error: "Failed to fetch book" },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/books/[id]
 * Update a book
 * Protected route - requires authentication
 * Only owner can update
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        const user = await requireAuth()
        const bookId = params.id
        const body = await request.json()

        // Check if book exists and user is owner
        const existingBook = await prisma.book.findUnique({
            where: { id: bookId },
        })

        if (!existingBook)
        {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            )
        }

        if (existingBook.ownerId !== user.id)
        {
            return NextResponse.json(
                { error: "Access denied. Only owner can update book." },
                { status: 403 }
            )
        }

        // Update book
        const updateData: any = {}
        if (body.title !== undefined) updateData.title = body.title
        if (body.content !== undefined) updateData.content = body.content
        if (body.description !== undefined) updateData.description = body.description
        if (body.visibility !== undefined) updateData.visibility = body.visibility
        if (body.categoryId !== undefined) updateData.categoryId = body.categoryId

        const book = await prisma.book.update({
            where: { id: bookId },
            data: updateData,
            include: {
                category: true,
            },
        })

        return NextResponse.json({ book })
    }
    catch (error)
    {
        console.error("Error updating book:", error)
        return NextResponse.json(
            { error: "Failed to update book" },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/books/[id]
 * Delete a book
 * Protected route - requires authentication
 * Only owner can delete
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        const user = await requireAuth()
        const bookId = params.id

        // Check if book exists and user is owner
        const existingBook = await prisma.book.findUnique({
            where: { id: bookId },
        })

        if (!existingBook)
        {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            )
        }

        if (existingBook.ownerId !== user.id)
        {
            return NextResponse.json(
                { error: "Access denied. Only owner can delete book." },
                { status: 403 }
            )
        }

        await prisma.book.delete({
            where: { id: bookId },
        })

        return NextResponse.json({ success: true })
    }
    catch (error)
    {
        console.error("Error deleting book:", error)
        return NextResponse.json(
            { error: "Failed to delete book" },
            { status: 500 }
        )
    }
}
