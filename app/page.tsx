import { getCurrentUser } from "@/lib/auth-server"
import { getRecentPublicBooks, getPopularPublicBooks } from "@/lib/queries/books"
import { HomeBookCard } from "@/components/home/book-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

/**
 * Home page with hero section and two book sections
 * @returns {Promise<JSX.Element>} Home page
 */
export default async function Home()
{
    const user = await getCurrentUser()
    const [recentBooks, popularBooks] = await Promise.all([
        getRecentPublicBooks(20),
        getPopularPublicBooks(20),
    ])

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <section className="text-center py-12 md:py-16 lg:py-20 mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                    Добро пожаловать в BookStore
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Откройте для себя удивительный мир книг. Читайте, делитесь и находите
                    вдохновение в произведениях других авторов.
                </p>
                {user ? (
                    <Link href="/dashboard">
                        <Button size="lg" className="gap-2">
                            <Plus className="w-5 h-5" />
                            Добавить книгу
                        </Button>
                    </Link>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Link href="/login">
                            <Button size="lg" className="gap-2">
                                <Plus className="w-5 h-5" />
                                Добавить книгу
                            </Button>
                        </Link>
                        <p className="text-sm text-gray-500">
                            Войдите, чтобы добавлять книги
                        </p>
                    </div>
                )}
            </section>

            {/* Recent Books Section */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Новые книги
                </h2>
                {recentBooks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">Пока нет новых книг</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {recentBooks.map((book) => (
                            <HomeBookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </section>

            {/* Popular Books Section */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Популярные книги
                </h2>
                {popularBooks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">Пока нет популярных книг</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {popularBooks.map((book) => (
                            <HomeBookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
