"use client"

import { useState } from "react"
import { MessageSquare, Star, Pencil, Trash2, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toggleFavorite, togglePublic, deleteBook } from "@/lib/actions/books"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface BookCardProps
{
    book: {
        id: string
        title: string
        content: string
        isPublic: boolean
        isFavorite: boolean
        ownerId: string
        owner?: {
            id: string
            name: string | null
        }
    }
    currentUserId: string
    onEdit: (book: any) => void
}

/**
 * Book card component
 * @param {BookCardProps} props - Component props
 * @returns {JSX.Element} Book card component
 */
export function BookCard({ book, currentUserId, onEdit }: BookCardProps)
{
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
    const [isTogglingPublic, setIsTogglingPublic] = useState(false)

    const isOwner = book.ownerId === currentUserId

    // Get preview text (first 100 characters)
    const preview = book.content.length > 100
        ? `${book.content.substring(0, 100)}...`
        : book.content

    const handleToggleFavorite = async () =>
    {
        if (isTogglingFavorite)
        {
            return
        }
        setIsTogglingFavorite(true)
        await toggleFavorite(book.id)
        setIsTogglingFavorite(false)
        router.refresh()
    }

    const handleTogglePublic = async () =>
    {
        if (isTogglingPublic || !isOwner)
        {
            return
        }
        setIsTogglingPublic(true)
        await togglePublic(book.id)
        setIsTogglingPublic(false)
        router.refresh()
    }

    const handleDelete = async () =>
    {
        if (!isOwner || isDeleting)
        {
            return
        }

        if (!confirm("Вы уверены, что хотите удалить эту книгу?"))
        {
            return
        }

        setIsDeleting(true)
        const result = await deleteBook(book.id)
        setIsDeleting(false)

        if (result.success)
        {
            router.refresh()
        }
        else
        {
            alert(result.error || "Ошибка при удалении")
        }
    }

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {preview}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                    {/* Favorite toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleToggleFavorite}
                        disabled={isTogglingFavorite}
                        className={cn(
                            "h-8 w-8",
                            book.isFavorite && "text-yellow-500 hover:text-yellow-600"
                        )}
                    >
                        <Star
                            className={cn(
                                "w-4 h-4",
                                book.isFavorite && "fill-current"
                            )}
                        />
                    </Button>

                    {/* Owner actions */}
                    {isOwner && (
                        <>
                            {/* Public/Private toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleTogglePublic}
                                disabled={isTogglingPublic}
                                className="h-8 w-8"
                                title={book.isPublic ? "Сделать приватной" : "Сделать публичной"}
                            >
                                {book.isPublic ? (
                                    <Globe className="w-4 h-4 text-green-600" />
                                ) : (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                )}
                            </Button>

                            {/* Edit */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(book)}
                                className="h-8 w-8"
                                title="Редактировать"
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>

                            {/* Delete */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Удалить"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    )
}
