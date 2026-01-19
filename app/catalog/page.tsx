import { getCurrentUser } from "@/lib/auth-server"
import { getPublicBooks } from "@/lib/queries/books"
import { HomeBookCard } from "@/components/home/book-card"
import { Button } from "@/components/ui/button"
import { CatalogSearchInput } from "@/components/catalog/search-input"

interface CatalogPageProps
{
    searchParams: Promise<{
        page?: string
        search?: string
        sort?: "popular" | "recent"
    }>
}

/**
 * Public catalog page - accessible without authentication
 * @param {CatalogPageProps} props - Page props
 * @returns {Promise<JSX.Element>} Catalog page
 */
export default async function CatalogPage({ searchParams }: CatalogPageProps)
{
    const user = await getCurrentUser()
    const params = await searchParams
    const page = parseInt(params.page || "1", 10)
    const search = params.search || ""
    const sort = params.sort === "popular" ? "popular" : "recent"
    const { books, total, totalPages } = await getPublicBooks(page, 20, search, sort)

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Каталог книг
                </h1>
                <p className="text-gray-600">
                    Просматривайте все публичные книги
                </p>
            </div>

            {/* Search and Sort */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="w-full sm:w-auto sm:flex-1 max-w-md">
                    <CatalogSearchInput
                        initialValue={search}
                        placeholder="Поиск по названию или содержанию..."
                    />
                </div>
                <div className="flex gap-2">
                    <a href="?sort=recent">
                        <Button
                            variant={sort === "recent" ? "default" : "outline"}
                            size="sm"
                        >
                            Новые
                        </Button>
                    </a>
                    <a href="?sort=popular">
                        <Button
                            variant={sort === "popular" ? "default" : "outline"}
                            size="sm"
                        >
                            Популярные
                        </Button>
                    </a>
                </div>
            </div>

            {/* Books Grid */}
            {books.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">Книги не найдены</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {books.map((book) => (
                            <HomeBookCard key={book.id} book={book} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            {page > 1 && (
                                <a href={`?page=${page - 1}${search ? `&search=${search}` : ""}${sort ? `&sort=${sort}` : ""}`}>
                                    <Button variant="outline" size="sm">
                                        Назад
                                    </Button>
                                </a>
                            )}
                            <span className="text-sm text-gray-600">
                                Страница {page} из {totalPages}
                            </span>
                            {page < totalPages && (
                                <a href={`?page=${page + 1}${search ? `&search=${search}` : ""}${sort ? `&sort=${sort}` : ""}`}>
                                    <Button variant="outline" size="sm">
                                        Вперед
                                    </Button>
                                </a>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
