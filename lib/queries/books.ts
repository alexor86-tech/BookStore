import { getCurrentUser } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

/**
 * Get user's books with pagination and search
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {string} search - Search query
 * @returns {Promise<{books: any[], total: number, totalPages: number}>} Books data
 */
export async function getUserBooks(page: number = 1, limit: number = 10, search: string = "")
{
    const user = await getCurrentUser()
    if (!user)
    {
        return { books: [], total: 0, totalPages: 0 }
    }

    const skip = (page - 1) * limit
    const searchFilter = search
        ? {
              OR: [
                  { title: { contains: search, mode: "insensitive" as const } },
                  { content: { contains: search, mode: "insensitive" as const } },
              ],
          }
        : {}

    const [books, total] = await Promise.all([
        prisma.book.findMany({
            where: {
                ownerId: user.id,
                ...searchFilter,
            },
            orderBy: {
                updatedAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.book.count({
            where: {
                ownerId: user.id,
                ...searchFilter,
            },
        }),
    ])

    return {
        books,
        total,
        totalPages: Math.ceil(total / limit),
    }
}

/**
 * Get public books with pagination and search
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {string} search - Search query
 * @returns {Promise<{books: any[], total: number, totalPages: number}>} Books data
 */
export async function getPublicBooks(page: number = 1, limit: number = 10, search: string = "")
{
    const skip = (page - 1) * limit
    const searchFilter = search
        ? {
              OR: [
                  { title: { contains: search, mode: "insensitive" as const } },
                  { content: { contains: search, mode: "insensitive" as const } },
              ],
          }
        : {}

    const [books, total] = await Promise.all([
        prisma.book.findMany({
            where: {
                isPublic: true,
                ...searchFilter,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.book.count({
            where: {
                isPublic: true,
                ...searchFilter,
            },
        }),
    ])

    return {
        books,
        total,
        totalPages: Math.ceil(total / limit),
    }
}

/**
 * Get favorite books with pagination and search
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {string} search - Search query
 * @returns {Promise<{books: any[], total: number, totalPages: number}>} Books data
 */
export async function getFavoriteBooks(page: number = 1, limit: number = 10, search: string = "")
{
    const user = await getCurrentUser()
    if (!user)
    {
        return { books: [], total: 0, totalPages: 0 }
    }

    const skip = (page - 1) * limit
    const searchFilter = search
        ? {
              OR: [
                  { title: { contains: search, mode: "insensitive" as const } },
                  { content: { contains: search, mode: "insensitive" as const } },
              ],
          }
        : {}

    const [books, total] = await Promise.all([
        prisma.book.findMany({
            where: {
                isFavorite: true,
                ...searchFilter,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            skip,
            take: limit,
        }),
        prisma.book.count({
            where: {
                isFavorite: true,
                ...searchFilter,
            },
        }),
    ])

    return {
        books,
        total,
        totalPages: Math.ceil(total / limit),
    }
}
