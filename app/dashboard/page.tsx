import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { SignOutButton } from "@/components/auth/sign-out-button"
import Link from "next/link"

/**
 * Dashboard page component
 * Protected route - requires authentication
 */
export default async function DashboardPage()
{
    const user = await getCurrentUser()

    // This should not happen due to middleware, but added for safety
    if (!user)
    {
        redirect("/login")
    }

    return (
        <main style={{
            minHeight: "100vh",
            padding: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
            }}>
                <h1 style={{
                    fontSize: "2.5rem",
                    color: "#333",
                    margin: 0,
                }}>
                    Личный кабинет
                </h1>
                <SignOutButton />
            </div>

            <div style={{
                backgroundColor: "white",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginBottom: "2rem",
            }}>
                <h2 style={{
                    fontSize: "1.5rem",
                    marginBottom: "1rem",
                    color: "#555",
                }}>
                    Информация о пользователе
                </h2>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                }}>
                    {user.image && (
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            style={{
                                width: "64px",
                                height: "64px",
                                borderRadius: "50%",
                            }}
                        />
                    )}
                    <div>
                        <p style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "#333",
                            margin: 0,
                        }}>
                            {user.name || "Пользователь"}
                        </p>
                        <p style={{
                            fontSize: "1rem",
                            color: "#666",
                            margin: 0,
                        }}>
                            {user.email}
                        </p>
                        <p style={{
                            fontSize: "0.9rem",
                            color: "#888",
                            margin: "0.5rem 0 0 0",
                            fontFamily: "monospace",
                        }}>
                            ID: {user.id}
                        </p>
                    </div>
                </div>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
            }}>
                <Link
                    href="/my-prompts"
                    style={{
                        padding: "1.5rem",
                        backgroundColor: "#0070f3",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontWeight: "500",
                        textAlign: "center",
                        transition: "background-color 0.2s",
                    }}
                >
                    Мои промты
                </Link>
                <Link
                    href="/"
                    style={{
                        padding: "1.5rem",
                        backgroundColor: "#f5f5f5",
                        color: "#333",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontWeight: "500",
                        textAlign: "center",
                        transition: "background-color 0.2s",
                    }}
                >
                    Главная страница
                </Link>
            </div>
        </main>
    )
}
