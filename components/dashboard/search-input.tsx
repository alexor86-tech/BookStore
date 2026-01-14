"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps
{
    value: string
    onChange: (value: string) => void
    placeholder?: string
    debounceMs?: number
}

/**
 * Search input with debounce
 * @param {SearchInputProps} props - Component props
 * @returns {JSX.Element} Search input component
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Поиск...",
    debounceMs = 300,
}: SearchInputProps)
{
    const [localValue, setLocalValue] = useState(value)

    useEffect(() =>
    {
        setLocalValue(value)
    }, [value])

    useEffect(() =>
    {
        const timer = setTimeout(() =>
        {
            onChange(localValue)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [localValue, debounceMs, onChange])

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="pl-10"
            />
        </div>
    )
}
