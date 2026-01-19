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
 * Get public books with pagination, search and sorting
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Items per page
 * @param {string} search - Search query
 * @param {string} sort - Sort order: "popular" or "recent" (default: "recent")
 * @returns {Promise<{books: any[], total: number, totalPages: number}>} Books data
 */
export async function getPublicBooks(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    sort: "popular" | "recent" = "recent"
)
{
    const user = await getCurrentUser()
    const skip = (page - 1) * limit
    const searchFilter = search
        ? {
              OR: [
                  { title: { contains: search, mode: "insensitive" as const } },
                  { content: { contains: search, mode: "insensitive" as const } },
              ],
          }
        : {}

    // For popular sort, we need to use a different approach since Prisma doesn't support
    // direct orderBy on _count. We'll fetch all matching books, sort in memory, then paginate.
    // For large datasets, consider using raw SQL or a materialized view.
    if (sort === "popular")
    {
        // Get all matching books with likes count
        const allBooks = await prisma.book.findMany({
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
                _count: {
                    select: {
                        likes: true,
                    },
                },
                ...(user
                    ? {
                          likes: {
                              where: {
                                  userId: user.id,
                              },
                              select: {
                                  id: true,
                              },
                          },
                      }
                    : {}),
            },
        })

        // Sort by likes count (descending), then by createdAt (descending) as tiebreaker
        allBooks.sort((a: typeof allBooks[0], b: typeof allBooks[0]) => {
            const likesDiff = b._count.likes - a._count.likes
            if (likesDiff !== 0)
            {
                return likesDiff
            }
            return b.createdAt.getTime() - a.createdAt.getTime()
        })

        // Paginate
        const total = allBooks.length
        const books = allBooks.slice(skip, skip + limit)

        // Transform books to include likesCount and likedByMe
        const booksWithLikes = books.map((book) => ({
            ...book,
            likesCount: book._count.likes,
            likedByMe: user ? book.likes && book.likes.length > 0 : false,
            likes: undefined, // Remove likes array from response
            _count: undefined, // Remove _count from response
        }))

        return {
            books: booksWithLikes,
            total,
            totalPages: Math.ceil(total / limit),
        }
    }

    // For recent sort, use standard Prisma orderBy
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
                _count: {
                    select: {
                        likes: true,
                    },
                },
                ...(user
                    ? {
                          likes: {
                              where: {
                                  userId: user.id,
                              },
                              select: {
                                  id: true,
                              },
                          },
                      }
                    : {}),
            },
            orderBy: {
                createdAt: "desc" as const,
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

    // Transform books to include likesCount and likedByMe
    const booksWithLikes = books.map((book) => ({
        ...book,
        likesCount: book._count.likes,
        likedByMe: user ? book.likes && book.likes.length > 0 : false,
        likes: undefined, // Remove likes array from response
        _count: undefined, // Remove _count from response
    }))

    return {
        books: booksWithLikes,
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
