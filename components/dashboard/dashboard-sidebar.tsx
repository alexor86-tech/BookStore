"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Star, History, Settings, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps
{
    userName?: string | null
    userImage?: string | null
}

/**
 * Dashboard sidebar component
 * @param {DashboardSidebarProps} props - Component props
 * @returns {JSX.Element} Sidebar component
 */
export function DashboardSidebar({ userName, userImage }: DashboardSidebarProps)
{
    const pathname = usePathname()

    const menuItems = [
        {
            href: "/dashboard",
            label: "Книги",
            icon: BookOpen,
        },
        {
            href: "/dashboard/public",
            label: "Публичные книги",
            icon: Globe,
        },
        {
            href: "/dashboard/favorites",
            label: "Избранное",
            icon: Star,
        },
        {
            href: "/dashboard/history",
            label: "История",
            icon: History,
        },
        {
            href: "/dashboard/settings",
            label: "Настройки",
            icon: Settings,
        },
    ]

    // Get user initials for avatar
    const getInitials = (name: string | null | undefined) =>
    {
        if (!name)
        {
            return "U"
        }
        const parts = name.split(" ")
        if (parts.length >= 2)
        {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        }
        return name[0].toUpperCase()
    }

    return (
        <aside className="w-[280px] min-h-screen bg-gradient-to-b from-blue-50 to-blue-100/50 border-r border-blue-200/50 flex flex-col">
            {/* User section */}
            <div className="p-6 border-b border-blue-200/50">
                <div className="flex items-center gap-3 mb-4">
                    {userImage ? (
                        <img
                            src={userImage}
                            alt={userName || "User"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg shadow-sm">
                            {getInitials(userName)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                            {userName || "Пользователь"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu items */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) =>
                    {
                        const Icon = item.icon
                        // For /dashboard, match exactly; for others, check if pathname starts with href
                        const isActive = item.href === "/dashboard"
                            ? pathname === item.href
                            : pathname.startsWith(item.href)

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-blue-500 text-white shadow-md"
                                            : "text-gray-700 hover:bg-blue-100/50 hover:text-blue-700"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}
