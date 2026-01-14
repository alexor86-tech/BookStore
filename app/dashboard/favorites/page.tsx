import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { getFavoriteBooks } from "@/lib/queries/books"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BooksList } from "@/components/dashboard/books-list"

interface FavoritesPageProps
{
    searchParams: {
        page?: string
        search?: string
    }
}

/**
 * Favorites page
 * @param {FavoritesPageProps} props - Page props
 * @returns {JSX.Element} Favorites page
 */
export default async function FavoritesPage({ searchParams }: FavoritesPageProps)
{
    const user = await getCurrentUser()

    if (!user)
    {
        redirect("/login")
    }

    const page = parseInt(searchParams.page || "1", 10)
    const search = searchParams.search || ""
    const { books, total, totalPages } = await getFavoriteBooks(page, 10, search)

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mt-2">Избранное</h2>
                </div>

                <BooksList
                    books={books}
                    total={total}
                    totalPages={totalPages}
                    currentPage={page}
                    currentUserId={user.id}
                    emptyMessage="У вас пока нет избранных книг"
                    showCreateButton={false}
                />
            </div>
        </DashboardLayout>
    )
}
