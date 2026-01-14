import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * @param {ClassValue[]} inputs - Array of class values to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs: ClassValue[])
{
    return twMerge(clsx(inputs))
}
