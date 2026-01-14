import { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

interface DashboardLayoutProps
{
    children: ReactNode
    user: {
        id: string
        name: string | null
        image: string | null
    }
}

/**
 * Dashboard layout wrapper
 * @param {DashboardLayoutProps} props - Component props
 * @returns {JSX.Element} Dashboard layout
 */
export function DashboardLayout({ children, user }: DashboardLayoutProps)
{
    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar userName={user.name} userImage={user.image} />
            <main className="flex-1 p-8 bg-white">
                {children}
            </main>
        </div>
    )
}
