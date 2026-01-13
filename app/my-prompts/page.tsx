import { redirect } from "next/navigation"
import { getCurrentUser, requireAuth } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { SignOutButton } from "@/components/auth/sign-out-button"
import Link from "next/link"
import type { Prisma } from "@prisma/client"

/**
 * My Prompts page component
 * Shows user's private books/prompts
 * Protected route - requires authentication
 */
export default async function MyPromptsPage()
{
    const user = await requireAuth()

    // Fetch user's books
    const userBooks = await prisma.book.findMany({
        where: {
            ownerId: user.id,
        },
        orderBy: {
            updatedAt: "desc",
        },
        include: {
            category: true,
        },
    })

    // Type for book with category
    type BookWithCategory = Prisma.BookGetPayload<{
        include: { category: true }
    }>

    return (
        <main style={{
            minHeight: "100vh",
            padding: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
            }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    color: "#333",
                    margin: 0,
                }}>
                    Мои промты
                </h1>
                <div style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                }}>
                    <Link
                        href="/dashboard"
                        style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.9rem",
                            backgroundColor: "#f5f5f5",
                            color: "#333",
                            textDecoration: "none",
                            borderRadius: "6px",
                            fontWeight: "500",
                        }}
                    >
                        Личный кабинет
                    </Link>
                    <SignOutButton />
                </div>
            </div>

            {userBooks.length === 0 ? (
                <div style={{
                    backgroundColor: "white",
                    padding: "3rem",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                }}>
                    <p style={{
                        fontSize: "1.2rem",
                        color: "#666",
                        margin: 0,
                    }}>
                        У вас пока нет промтов
                    </p>
                    <p style={{
                        fontSize: "1rem",
                        color: "#888",
                        marginTop: "0.5rem",
                    }}>
                        Создайте свой первый промт!
                    </p>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gap: "1rem",
                }}>
                    {userBooks.map((book: BookWithCategory) => (
                        <div
                            key={book.id}
                            style={{
                                backgroundColor: "white",
                                padding: "1.5rem",
                                borderRadius: "12px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                                marginBottom: "0.5rem",
                            }}>
                                <h3 style={{
                                    fontSize: "1.3rem",
                                    color: "#333",
                                    margin: 0,
                                }}>
                                    {book.title}
                                </h3>
                                <span style={{
                                    padding: "0.25rem 0.75rem",
                                    fontSize: "0.8rem",
                                    backgroundColor: book.visibility === "PUBLIC" ? "#10b981" : "#6b7280",
                                    color: "white",
                                    borderRadius: "12px",
                                    fontWeight: "500",
                                }}>
                                    {book.visibility === "PUBLIC" ? "Публичный" : "Приватный"}
                                </span>
                            </div>
                            {book.description && (
                                <p style={{
                                    color: "#666",
                                    marginBottom: "0.5rem",
                                }}>
                                    {book.description}
                                </p>
                            )}
                            <div style={{
                                display: "flex",
                                gap: "1rem",
                                fontSize: "0.9rem",
                                color: "#888",
                            }}>
                                <span>Категория: {book.category.category}</span>
                                <span>•</span>
                                <span>Обновлено: {new Date(book.updatedAt).toLocaleDateString("ru-RU")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    )
}
