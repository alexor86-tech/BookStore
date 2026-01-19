"use client"

import { useState } from "react"
import { ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface LikeButtonProps
{
    bookId: string
    initialLiked: boolean
    initialCount: number
}

/**
 * Like button component with optimistic update
 * @param {LikeButtonProps} props - Component props
 * @returns {JSX.Element} Like button component
 */
export function LikeButton({ bookId, initialLiked, initialCount }: LikeButtonProps)
{
    const router = useRouter()
    const [liked, setLiked] = useState(initialLiked)
    const [count, setCount] = useState(initialCount)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLike = async () =>
    {
        if (loading)
        {
            return
        }

        // Optimistic update
        const previousLiked = liked
        const previousCount = count
        setLiked(!liked)
        setCount((prev) => (previousLiked ? prev - 1 : prev + 1))
        setLoading(true)
        setError(null)

        try
        {
            const response = await fetch(`/api/books/${bookId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok)
            {
                const data = await response.json()

                // Revert optimistic update
                setLiked(previousLiked)
                setCount(previousCount)

                if (response.status === 401)
                {
                    setError("Необходимо войти в систему")
                    // Redirect to login after a short delay
                    setTimeout(() => {
                        router.push("/login")
                    }, 1500)
                }
                else if (response.status === 404)
                {
                    setError("Книга не найдена")
                }
                else if (response.status === 403)
                {
                    setError("Только публичные книги можно лайкать")
                }
                else
                {
                    setError(data.error || "Ошибка при обновлении лайка")
                }
                return
            }

            const data = await response.json()
            setLiked(data.liked)
            setCount(data.likesCount)

            // Refresh to ensure consistency
            router.refresh()
        }
        catch (err)
        {
            // Revert optimistic update
            setLiked(previousLiked)
            setCount(previousCount)
            setError("Ошибка соединения. Попробуйте позже.")
            console.error("Error toggling like:", err)
        }
        finally
        {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={loading}
                className={cn(
                    "h-8 gap-1.5",
                    liked && "text-blue-600 hover:text-blue-700"
                )}
                title={liked ? "Убрать лайк" : "Поставить лайк"}
            >
                <ThumbsUp
                    className={cn(
                        "w-4 h-4",
                        liked && "fill-current"
                    )}
                />
                <span className="text-sm font-medium">{count}</span>
            </Button>
            {error && (
                <span className="text-xs text-red-600">{error}</span>
            )}
        </div>
    )
}
