import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { getPublicBooks } from "@/lib/queries/books"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { BooksList } from "@/components/dashboard/books-list"

interface PublicBooksPageProps
{
    searchParams: {
        page?: string
        search?: string
        sort?: "popular" | "recent"
    }
}

/**
 * Public books page
 * @param {PublicBooksPageProps} props - Page props
 * @returns {JSX.Element} Public books page
 */
export default async function PublicBooksPage({ searchParams }: PublicBooksPageProps)
{
    const user = await getCurrentUser()

    if (!user)
    {
        redirect("/login")
    }

    const page = parseInt(searchParams.page || "1", 10)
    const search = searchParams.search || ""
    const sort = searchParams.sort === "popular" ? "popular" : "recent"
    const { books, total, totalPages } = await getPublicBooks(page, 10, search, sort)

    return (
        <DashboardLayout user={user}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mt-2">Публичные книги</h2>
                </div>

                <BooksList
                    books={books}
                    total={total}
                    totalPages={totalPages}
                    currentPage={page}
                    currentUserId={user.id}
                    emptyMessage="Публичные книги не найдены"
                    showCreateButton={false}
                    showLikeButton={true}
                    sort={sort}
                />
            </div>
        </DashboardLayout>
    )
}
