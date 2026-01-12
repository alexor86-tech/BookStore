import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, getDatabaseUrl } from '@/lib/prisma-factory'
import { getModelName, getTableData, getTableCount } from '@/lib/db-utils'

/**
 * GET /api/db/table/[tableName]
 * Returns paginated data from a table
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { tableName: string } }
)
{
    try
    {
        const searchParams = request.nextUrl.searchParams
        const dbType = (searchParams.get('dbType') || 'production') as 'local' | 'production'
        const page = parseInt(searchParams.get('page') || '1', 10)
        const pageSize = parseInt(searchParams.get('pageSize') || '20', 10)

        const databaseUrl = getDatabaseUrl(dbType)
        if (!databaseUrl)
        {
            return NextResponse.json(
                { error: 'Database URL not configured' },
                { status: 500 }
            )
        }

        const prisma = createPrismaClient(databaseUrl)
        const modelName = getModelName(params.tableName)

        const [data, totalCount] = await Promise.all([
            getTableData(prisma, modelName, page, pageSize),
            getTableCount(prisma, modelName),
        ])

        await prisma.$disconnect()

        return NextResponse.json({
            data,
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        })
    }
    catch (error: any)
    {
        console.error('Error fetching table data:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch table data' },
            { status: 500 }
        )
    }
}
