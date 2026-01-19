import Link from "next/link"
import { getCurrentUser } from "@/lib/auth-server"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { User } from "lucide-react"

/**
 * Header component with navigation and user profile
 * @returns {Promise<JSX.Element>} Header component
 */
export async function Header()
{
    const user = await getCurrentUser()

    return (
        <header className="border-b bg-white sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
                    >
                        BookStore
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        >
                            Главная
                        </Link>
                        <Link
                            href="/catalog"
                            className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        >
                            Каталог
                        </Link>
                        {user && (
                            <Link
                                href="/dashboard"
                                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Мои книги
                            </Link>
                        )}
                    </nav>

                    {/* User section */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-3">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || user.email}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-700">
                                        {user.name || user.email}
                                    </span>
                                </div>
                                <SignOutButton />
                            </>
                        ) : (
                            <Link href="/login">
                                <Button variant="default">
                                    Войти
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
