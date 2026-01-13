import type { Metadata } from 'next'
import './globals.css'
import { AuthSessionProvider } from '@/components/providers/session-provider'

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
            <body>
                <AuthSessionProvider>
                    {children}
                </AuthSessionProvider>
            </body>
        </html>
    )
}
