import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient, getDatabaseUrl } from '@/lib/prisma-factory'
import { getModelName, deleteRecord } from '@/lib/db-utils'

/**
 * DELETE /api/db/table/[tableName]/delete
 * Deletes a record from a table
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { tableName: string } }
)
{
    try
    {
        const searchParams = request.nextUrl.searchParams
        const dbType = (searchParams.get('dbType') || 'production') as 'local' | 'production'
        const id = searchParams.get('id')

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

        const record = await deleteRecord(prisma, modelName, id)

        await prisma.$disconnect()

        return NextResponse.json({ record })
    }
    catch (error: any)
    {
        console.error('Error deleting record:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete record' },
            { status: 500 }
        )
    }
}
