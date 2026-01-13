"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

/**
 * Error page content component
 */
function ErrorContent()
{
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

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
                maxWidth: "500px",
                width: "100%",
            }}>
                <h1 style={{
                    fontSize: "2rem",
                    marginBottom: "1rem",
                    color: "#dc2626",
                    textAlign: "center",
                }}>
                    Ошибка аутентификации
                </h1>
                <p style={{
                    color: "#666",
                    marginBottom: "2rem",
                    textAlign: "center",
                }}>
                    {error === "Configuration"
                        ? "Проблема с конфигурацией сервера. Проверьте переменные окружения."
                        : error === "AccessDenied"
                            ? "Доступ запрещен."
                            : "Произошла ошибка при входе. Попробуйте еще раз."}
                </p>
                <div style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                }}>
                    <Link
                        href="/login"
                        style={{
                            padding: "0.75rem 1.5rem",
                            fontSize: "1rem",
                            backgroundColor: "#4285f4",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontWeight: "500",
                        }}
                    >
                        Попробовать снова
                    </Link>
                    <Link
                        href="/"
                        style={{
                            padding: "0.75rem 1.5rem",
                            fontSize: "1rem",
                            backgroundColor: "#f5f5f5",
                            color: "#333",
                            textDecoration: "none",
                            borderRadius: "8px",
                            fontWeight: "500",
                        }}
                    >
                        На главную
                    </Link>
                </div>
            </div>
        </main>
    )
}

/**
 * Error page for authentication errors
 */
export default function AuthErrorPage()
{
    return (
        <Suspense fallback={
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
                    textAlign: "center",
                }}>
                    <p>Загрузка...</p>
                </div>
            </main>
        }>
            <ErrorContent />
        </Suspense>
    )
}
