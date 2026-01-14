"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createBook, updateBook } from "@/lib/actions/books"

interface BookDialogProps
{
    open: boolean
    onOpenChange: (open: boolean) => void
    book?: {
        id: string
        title: string
        content: string
        isPublic: boolean
    } | null
}

/**
 * Dialog component for creating/editing books
 * @param {BookDialogProps} props - Component props
 * @returns {JSX.Element} Book dialog component
 */
export function BookDialog({ open, onOpenChange, book }: BookDialogProps)
{
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isEditMode = !!book

    // Reset form when dialog opens/closes or book changes
    useEffect(() =>
    {
        if (open)
        {
            if (book)
            {
                setTitle(book.title)
                setContent(book.content)
                setIsPublic(book.isPublic)
            }
            else
            {
                setTitle("")
                setContent("")
                setIsPublic(false)
            }
            setError(null)
        }
    }, [open, book])

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try
        {
            let result
            if (isEditMode && book)
            {
                result = await updateBook({
                    id: book.id,
                    title,
                    content,
                    isPublic,
                })
            }
            else
            {
                result = await createBook({
                    title,
                    content,
                    isPublic,
                })
            }

            if (result.success)
            {
                onOpenChange(false)
                router.refresh()
            }
            else
            {
                setError(result.error || "Произошла ошибка")
            }
        }
        catch (err)
        {
            setError("Произошла ошибка при сохранении")
        }
        finally
        {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditMode ? "Редактировать книгу" : "Новая книга"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditMode
                                ? "Внесите изменения в книгу"
                                : "Заполните форму для создания новой книги"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Название</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Введите название книги"
                                required
                                maxLength={200}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Содержание</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Введите содержание книги"
                                required
                                rows={8}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="isPublic" className="cursor-pointer">
                                Публичная книга
                            </Label>
                            <Switch
                                id="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                {error}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Сохранение..."
                                : isEditMode
                                  ? "Сохранить"
                                  : "Создать"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
