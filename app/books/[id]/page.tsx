import { notFound } from "next/navigation"
import { getPublicBookById } from "@/lib/queries/books"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LikeButton } from "@/components/dashboard/like-button"
import { Calendar, User, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface BookPageProps
{
    params: {
        id: string
    }
}

/**
 * Book detail page
 * @param {BookPageProps} props - Page props
 * @returns {Promise<JSX.Element>} Book detail page
 */
export default async function BookPage({ params }: BookPageProps)
{
    const book = await getPublicBookById(params.id)

    if (!book)
    {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
            <Link href="/">
                <Button variant="ghost" className="mb-6">
                    ← Назад к списку
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl mb-4">{book.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{book.owner.name || book.owner.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                                {new Date(book.createdAt).toLocaleDateString("ru-RU", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {book.description && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Описание</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {book.description}
                            </p>
                        </div>
                    )}

                    {book.content && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Содержание</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {book.content}
                                </p>
                            </div>
                        </div>
                    )}

                    {book.tags && book.tags.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Теги</h3>
                            <div className="flex flex-wrap gap-2">
                                {book.tags.map((tagOnBook) => (
                                    <Badge key={tagOnBook.tag.id} variant="secondary">
                                        {tagOnBook.tag.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t">
                        {book.likesCount !== undefined && (
                            <LikeButton
                                bookId={book.id}
                                initialLiked={book.likedByMe || false}
                                initialCount={book.likesCount}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
