import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/books
 * Get user's books
 * Protected route - requires authentication
 */
export async function GET(request: NextRequest)
{
    try
    {
        const user = await requireAuth()

        // Get query parameters
        const searchParams = request.nextUrl.searchParams
        const visibility = searchParams.get("visibility") // "PUBLIC" | "PRIVATE" | null (all)

        // Build where clause
        const where: any = {
            ownerId: user.id,
        }

        if (visibility === "PUBLIC" || visibility === "PRIVATE")
        {
            where.visibility = visibility
        }

        const books = await prisma.book.findMany({
            where,
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                category: true,
            },
        })

        return NextResponse.json({ books })
    }
    catch (error)
    {
        console.error("Error fetching books:", error)
        return NextResponse.json(
            { error: "Failed to fetch books" },
            { status: 500 }
        )
    }
}

/**
 * POST /api/books
 * Create a new book
 * Protected route - requires authentication
 */
export async function POST(request: NextRequest)
{
    try
    {
        const user = await requireAuth()
        const body = await request.json()

        const { title, content, description, categoryId, visibility } = body

        // Validate required fields
        if (!title || !content || !categoryId)
        {
            return NextResponse.json(
                { error: "Missing required fields: title, content, categoryId" },
                { status: 400 }
            )
        }

        // Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        })

        if (!category)
        {
            return NextResponse.json(
                { error: "Category not found" },
                { status: 404 }
            )
        }

        // Create book
        const book = await prisma.book.create({
            data: {
                title,
                content,
                description: description || null,
                visibility: visibility || "PRIVATE",
                ownerId: user.id,
                categoryId,
            },
            include: {
                category: true,
            },
        })

        return NextResponse.json({ book }, { status: 201 })
    }
    catch (error)
    {
        console.error("Error creating book:", error)
        return NextResponse.json(
            { error: "Failed to create book" },
            { status: 500 }
        )
    }
}
