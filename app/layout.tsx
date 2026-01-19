import type { Metadata } from 'next'
import './globals.css'
import { AuthSessionProvider } from '@/components/providers/session-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
    title: 'BookStore',
    description: 'Minimal Next.js + Prisma + NeonDB project',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
})
{
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen">
                <AuthSessionProvider>
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </AuthSessionProvider>
            </body>
        </html>
    )
}
