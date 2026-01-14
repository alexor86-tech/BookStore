"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/dashboard/book-card"
import { BookDialog } from "@/components/dashboard/book-dialog"
import { SearchInput } from "@/components/dashboard/search-input"

interface BooksListProps
{
    books: any[]
    total: number
    totalPages: number
    currentPage: number
    currentUserId: string
    emptyMessage?: string
    showCreateButton?: boolean
}

/**
 * Books list component with search, pagination and create button
 * @param {BooksListProps} props - Component props
 * @returns {JSX.Element} Books list component
 */
export function BooksList({
    books,
    total,
    totalPages,
    currentPage,
    currentUserId,
    emptyMessage = "Книги не найдены",
    showCreateButton = true,
}: BooksListProps)
{
    const router = useRouter()
    const searchParams = useSearchParams()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingBook, setEditingBook] = useState<any>(null)
    const [search, setSearch] = useState(searchParams.get("search") || "")

    const handleCreateClick = () =>
    {
        setEditingBook(null)
        setDialogOpen(true)
    }

    const handleEditClick = (book: any) =>
    {
        setEditingBook(book)
        setDialogOpen(true)
    }

    const handleSearchChange = (value: string) =>
    {
        setSearch(value)
        const params = new URLSearchParams(searchParams.toString())
        if (value)
        {
            params.set("search", value)
            params.set("page", "1")
        }
        else
        {
            params.delete("search")
            params.set("page", "1")
        }
        router.push(`?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) =>
    {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`?${params.toString()}`)
    }

    return (
        <>
            <div className="space-y-4">
                {/* Search and Create button */}
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <SearchInput
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Поиск по названию или содержанию..."
                        />
                    </div>
                    {showCreateButton && (
                        <Button onClick={handleCreateClick} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Новая книга
                        </Button>
                    )}
                </div>

                {/* Books list */}
                {books.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">{emptyMessage}</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {books.map((book) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    currentUserId={currentUserId}
                                    onEdit={handleEditClick}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Назад
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Страница {currentPage} из {totalPages} ({total} книг)
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                >
                                    Вперед
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Dialog */}
            <BookDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                book={editingBook}
            />
        </>
    )
}
