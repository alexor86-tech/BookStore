"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CatalogSearchInputProps
{
    initialValue: string
    placeholder?: string
}

/**
 * Search input for catalog page with URL params
 * @param {CatalogSearchInputProps} props - Component props
 * @returns {JSX.Element} Search input component
 */
export function CatalogSearchInput({
    initialValue,
    placeholder = "Поиск...",
}: CatalogSearchInputProps)
{
    const router = useRouter()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(initialValue)

    useEffect(() =>
    {
        setValue(initialValue)
    }, [initialValue])

    const handleSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault()
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
        router.push(`/catalog?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="pl-10"
            />
        </form>
    )
}
