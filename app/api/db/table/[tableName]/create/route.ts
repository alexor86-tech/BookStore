import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, getDatabaseUrl } from '@/lib/prisma-factory'
import { getModelName, createRecord } from '@/lib/db-utils'

/**
 * POST /api/db/table/[tableName]/create
 * Creates a new record in a table
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { tableName: string } }
)
{
    try
    {
        const searchParams = request.nextUrl.searchParams
        const dbType = (searchParams.get('dbType') || 'production') as 'local' | 'production'
        const body = await request.json()

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

        const record = await createRecord(prisma, modelName, body)

        await prisma.$disconnect()

        return NextResponse.json({ record })
    }
    catch (error: any)
    {
        console.error('Error creating record:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to create record' },
            { status: 500 }
        )
    }
}
