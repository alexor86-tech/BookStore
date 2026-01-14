import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

/**
 * History page (placeholder)
 * @returns {JSX.Element} History page
 */
export default async function HistoryPage()
{
    const user = await getCurrentUser()

    if (!user)
    {
        redirect("/login")
    }

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mt-2">История</h2>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">Скоро…</p>
                    <p className="text-sm mt-2">
                        История просмотров и активности будет доступна здесь
                    </p>
                </div>
            </div>
        </DashboardLayout>
    )
}
