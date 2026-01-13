import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth-server"
import { SignInButton } from "@/components/auth/sign-in-button"

/**
 * Login page component
 * Redirects authenticated users to dashboard
 */
export default async function LoginPage()
{
    const session = await getSession()

    // Redirect if already authenticated
    if (session)
    {
        redirect("/dashboard")
    }

    return (
        <main style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "3rem",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "400px",
                width: "100%",
            }}>
                <h1 style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                    color: "#333",
                    textAlign: "center",
                }}>
                    Вход в BookStore
                </h1>
                <p style={{
                    color: "#666",
                    marginBottom: "2rem",
                    textAlign: "center",
                }}>
                    Войдите через Google, чтобы продолжить
                </p>
                <SignInButton />
            </div>
        </main>
    )
}
