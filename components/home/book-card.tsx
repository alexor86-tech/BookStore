"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LikeButton } from "@/components/dashboard/like-button"
import { BookOpen, Calendar, User } from "lucide-react"

interface BookCardProps
{
    book: {
        id: string
        title: string
        description: string | null
        createdAt: Date
        owner: {
            id: string
            name: string | null
            email: string
        }
        tags?: Array<{
            tag: {
                id: string
                name: string
            }
        }>
        likesCount?: number
        likedByMe?: boolean
    }
}

/**
 * Book card component for home page (read-only)
 * @param {BookCardProps} props - Component props
 * @returns {JSX.Element} Book card component
 */
export function HomeBookCard({ book }: BookCardProps)
{
    // Get preview text (first 150 characters)
    const preview = book.description
        ? (book.description.length > 150
            ? `${book.description.substring(0, 150)}...`
            : book.description)
        : ""

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-xl mb-2 line-clamp-2">
                    {book.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{book.owner.name || book.owner.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {new Date(book.createdAt).toLocaleDateString("ru-RU", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </CardHeader>

            {preview && (
                <CardContent className="flex-1">
                    <p className="text-sm text-gray-700 line-clamp-3">
                        {preview}
                    </p>
                </CardContent>
            )}

            {book.tags && book.tags.length > 0 && (
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {book.tags.map((tagOnBook) => (
                            <Badge
                                key={tagOnBook.tag.id}
                                variant="secondary"
                            >
                                {tagOnBook.tag.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            )}

            <CardFooter className="flex items-center justify-between gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                    {book.likesCount !== undefined && (
                        <LikeButton
                            bookId={book.id}
                            initialLiked={book.likedByMe || false}
                            initialCount={book.likesCount}
                        />
                    )}
                </div>
                <Link href={`/books/${book.id}`}>
                    <Button variant="default" size="sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Открыть
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
