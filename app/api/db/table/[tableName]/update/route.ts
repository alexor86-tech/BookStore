import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, getDatabaseUrl } from '@/lib/prisma-factory'
import { getModelName, updateRecord } from '@/lib/db-utils'

/**
 * PUT /api/db/table/[tableName]/update
 * Updates a record in a table
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { tableName: string } }
)
{
    try
    {
        const searchParams = request.nextUrl.searchParams
        const dbType = (searchParams.get('dbType') || 'production') as 'local' | 'production'
        const body = await request.json()
        const { id, ...data } = body

        if (!id)
        {
            return NextResponse.json(
                { error: 'Record ID is required' },
                { status: 400 }
            )
        }

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

        const record = await updateRecord(prisma, modelName, id, data)

        await prisma.$disconnect()

        return NextResponse.json({ record })
    }
    catch (error: any)
    {
        console.error('Error updating record:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to update record' },
            { status: 500 }
        )
    }
}
