"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

// Validation schemas
const createBookSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    content: z.string().min(1, "Content is required"),
    isPublic: z.boolean().default(false),
})

const updateBookSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    content: z.string().min(1, "Content is required"),
    isPublic: z.boolean(),
})

/**
 * Create a new book
 * @param {z.infer<typeof createBookSchema>} data - Book data
 * @returns {Promise<{success: boolean, book?: any, error?: string}>} Result object
 */
export async function createBook(data: z.infer<typeof createBookSchema>)
{
    try
    {
        const user = await requireAuth()
        const validatedData = createBookSchema.parse(data)

        const book = await prisma.book.create({
            data: {
                title: validatedData.title,
                content: validatedData.content,
                isPublic: validatedData.isPublic,
                ownerId: user.id,
            },
        })

        revalidatePath("/dashboard")
        return { success: true, book }
    }
    catch (error)
    {
        if (error instanceof z.ZodError)
        {
            return { success: false, error: error.issues[0].message }
        }
        console.error("Error creating book:", error)
        return { success: false, error: "Failed to create book" }
    }
}

/**
 * Update an existing book
 * @param {z.infer<typeof updateBookSchema>} data - Book data with id
 * @returns {Promise<{success: boolean, book?: any, error?: string}>} Result object
 */
export async function updateBook(data: z.infer<typeof updateBookSchema>)
{
    try
    {
        const user = await requireAuth()
        const validatedData = updateBookSchema.parse(data)

        // Check if book exists and user owns it
        const existingBook = await prisma.book.findUnique({
            where: { id: validatedData.id },
        })

        if (!existingBook)
        {
            return { success: false, error: "Book not found" }
        }

        if (existingBook.ownerId !== user.id)
        {
            return { success: false, error: "Unauthorized" }
        }

        const book = await prisma.book.update({
            where: { id: validatedData.id },
            data: {
                title: validatedData.title,
                content: validatedData.content,
                isPublic: validatedData.isPublic,
            },
        })

        revalidatePath("/dashboard")
        return { success: true, book }
    }
    catch (error)
    {
        if (error instanceof z.ZodError)
        {
            return { success: false, error: error.issues[0].message }
        }
        console.error("Error updating book:", error)
        return { success: false, error: "Failed to update book" }
    }
}

/**
 * Delete a book
 * @param {string} id - Book ID
 * @returns {Promise<{success: boolean, error?: string}>} Result object
 */
export async function deleteBook(id: string)
{
    try
    {
        const user = await requireAuth()

        // Check if book exists and user owns it
        const existingBook = await prisma.book.findUnique({
            where: { id },
        })

        if (!existingBook)
        {
            return { success: false, error: "Book not found" }
        }

        if (existingBook.ownerId !== user.id)
        {
            return { success: false, error: "Unauthorized" }
        }

        await prisma.book.delete({
            where: { id },
        })

        revalidatePath("/dashboard")
        return { success: true }
    }
    catch (error)
    {
        console.error("Error deleting book:", error)
        return { success: false, error: "Failed to delete book" }
    }
}

/**
 * Toggle book public/private status
 * @param {string} id - Book ID
 * @returns {Promise<{success: boolean, book?: any, error?: string}>} Result object
 */
export async function togglePublic(id: string)
{
    try
    {
        const user = await requireAuth()

        // Check if book exists and user owns it
        const existingBook = await prisma.book.findUnique({
            where: { id },
        })

        if (!existingBook)
        {
            return { success: false, error: "Book not found" }
        }

        if (existingBook.ownerId !== user.id)
        {
            return { success: false, error: "Unauthorized" }
        }

        const book = await prisma.book.update({
            where: { id },
            data: {
                isPublic: !existingBook.isPublic,
            },
        })

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/public")
        return { success: true, book }
    }
    catch (error)
    {
        console.error("Error toggling public status:", error)
        return { success: false, error: "Failed to toggle public status" }
    }
}

/**
 * Toggle book favorite status
 * @param {string} id - Book ID
 * @returns {Promise<{success: boolean, book?: any, error?: string}>} Result object
 */
export async function toggleFavorite(id: string)
{
    try
    {
        const user = await requireAuth()

        // Check if book exists
        const existingBook = await prisma.book.findUnique({
            where: { id },
        })

        if (!existingBook)
        {
            return { success: false, error: "Book not found" }
        }

        // User can favorite any book (not just their own)
        const book = await prisma.book.update({
            where: { id },
            data: {
                isFavorite: !existingBook.isFavorite,
            },
        })

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/favorites")
        return { success: true, book }
    }
    catch (error)
    {
        console.error("Error toggling favorite status:", error)
        return { success: false, error: "Failed to toggle favorite status" }
    }
}
