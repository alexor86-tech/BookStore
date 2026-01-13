import { PrismaClient } from '@prisma/client'

// Check if we're in Edge Runtime
const isEdgeRuntime = typeof EdgeRuntime !== 'undefined' ||
    (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge')

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Only create Prisma Client if not in Edge Runtime
// In Edge Runtime, Prisma cannot be used - return null
let prismaInstance: PrismaClient | null = null

if (!isEdgeRuntime)
{
    prismaInstance =
        globalForPrisma.prisma ??
        new PrismaClient({
            log: process.env.NODE_ENV === 'development'
                ? [
                    {
                        emit: 'event',
                        level: 'query',
                    },
                    {
                        emit: 'event',
                        level: 'error',
                    },
                    {
                        emit: 'event',
                        level: 'warn',
                    },
                ]
                : ['error'],
        })

    // Log Prisma queries and errors in development
    if (process.env.NODE_ENV === 'development' && prismaInstance)
    {
        prismaInstance.$on('query' as never, (e: any) =>
        {
            console.log('[PRISMA] Query:', e.query)
            console.log('[PRISMA] Params:', e.params)
            console.log('[PRISMA] Duration:', e.duration, 'ms')
        })

        prismaInstance.$on('error' as never, (e: any) =>
        {
            console.error('[PRISMA] Error:', e)
        })

        prismaInstance.$on('warn' as never, (e: any) =>
        {
            console.warn('[PRISMA] Warning:', e)
        })
    }

    if (process.env.NODE_ENV !== 'production')
    {
        globalForPrisma.prisma = prismaInstance
    }
}

// Export prisma - will be null in Edge Runtime
export const prisma = prismaInstance as any
