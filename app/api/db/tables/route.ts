import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, getDatabaseUrl } from '@/lib/prisma-factory'
import { getTableNames, getTableCount, getModelName } from '@/lib/db-utils'

/**
 * GET /api/db/tables
 * Returns list of tables with record counts
 */
export async function GET(request: NextRequest)
{
    try
    {
        const searchParams = request.nextUrl.searchParams
        const dbType = (searchParams.get('dbType') || 'production') as 'local' | 'production'

        const databaseUrl = getDatabaseUrl(dbType)
        if (!databaseUrl)
        {
            return NextResponse.json(
                { error: 'Database URL not configured' },
                { status: 500 }
            )
        }

        const prisma = createPrismaClient(databaseUrl)
        const tableNames = getTableNames()

        const tables = await Promise.all(
            tableNames.map(async (tableName) => {
                const modelName = getModelName(tableName)
                const count = await getTableCount(prisma, modelName)
                return {
                    name: tableName,
                    modelName,
                    count,
                }
            })
        )

        await prisma.$disconnect()

        return NextResponse.json({ tables })
    }
    catch (error: any)
    {
        console.error('Error fetching tables:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch tables' },
            { status: 500 }
        )
    }
}
