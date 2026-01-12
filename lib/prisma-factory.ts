import { PrismaClient } from '@prisma/client'

/**
 * Creates a Prisma client with a specific database URL
 * @param [in] databaseUrl - Database connection string
 * @returns [out] PrismaClient instance
 */
export function createPrismaClient(databaseUrl: string): PrismaClient
{
    return new PrismaClient({
        datasources: {
            db: {
                url: databaseUrl,
            },
        },
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
}

/**
 * Gets database URL based on environment type
 * @param [in] dbType - 'local' or 'production'
 * @returns [out] Database connection string
 */
export function getDatabaseUrl(dbType: 'local' | 'production'): string
{
    if (dbType === 'local')
    {
        return process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL || ''
    }
    return process.env.DATABASE_URL || ''
}
