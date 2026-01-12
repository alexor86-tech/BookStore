import { PrismaClient } from '@prisma/client'

/**
 * Gets list of table names from Prisma schema
 * @returns [out] Array of table names
 */
export function getTableNames(): string[]
{
    // Get table names from Prisma schema models
    return [
        'users',
        'notes',
        'categories',
        'books',
        'votes',
        'tags',
        'tag_on_book',
    ]
}

/**
 * Gets model name from table name
 * @param [in] tableName - Table name in database
 * @returns [out] Model name in Prisma
 */
export function getModelName(tableName: string): string
{
    const mapping: Record<string, string> = {
        'users': 'user',
        'notes': 'note',
        'categories': 'category',
        'books': 'book',
        'votes': 'vote',
        'tags': 'tag',
        'tag_on_book': 'tagOnBook',
    }
    return mapping[tableName] || tableName
}

/**
 * Gets count of records in a table
 * @param [in] prisma - Prisma client instance
 * @param [in] modelName - Model name
 * @returns [out] Number of records
 */
export async function getTableCount(
    prisma: PrismaClient,
    modelName: string
): Promise<number>
{
    try
    {
        const model = (prisma as any)[modelName]
        if (!model)
        {
            return 0
        }
        return await model.count()
    }
    catch (error)
    {
        console.error(`Error counting ${modelName}:`, error)
        return 0
    }
}

/**
 * Gets paginated records from a table
 * @param [in] prisma - Prisma client instance
 * @param [in] modelName - Model name
 * @param [in] page - Page number (1-based)
 * @param [in] pageSize - Number of records per page
 * @returns [out] Array of records
 */
export async function getTableData(
    prisma: PrismaClient,
    modelName: string,
    page: number = 1,
    pageSize: number = 20
): Promise<any[]>
{
    try
    {
        const model = (prisma as any)[modelName]
        if (!model)
        {
            return []
        }

        const skip = (page - 1) * pageSize
        return await model.findMany({
            skip,
            take: pageSize,
            orderBy: {
                id: 'asc',
            },
        })
    }
    catch (error)
    {
        console.error(`Error fetching ${modelName}:`, error)
        return []
    }
}

/**
 * Creates a new record in a table
 * @param [in] prisma - Prisma client instance
 * @param [in] modelName - Model name
 * @param [in] data - Record data
 * @returns [out] Created record
 */
export async function createRecord(
    prisma: PrismaClient,
    modelName: string,
    data: any
): Promise<any>
{
    try
    {
        const model = (prisma as any)[modelName]
        if (!model)
        {
            throw new Error(`Model ${modelName} not found`)
        }
        return await model.create({
            data,
        })
    }
    catch (error)
    {
        console.error(`Error creating ${modelName}:`, error)
        throw error
    }
}

/**
 * Updates a record in a table
 * @param [in] prisma - Prisma client instance
 * @param [in] modelName - Model name
 * @param [in] id - Record ID
 * @param [in] data - Updated data
 * @returns [out] Updated record
 */
export async function updateRecord(
    prisma: PrismaClient,
    modelName: string,
    id: string,
    data: any
): Promise<any>
{
    try
    {
        const model = (prisma as any)[modelName]
        if (!model)
        {
            throw new Error(`Model ${modelName} not found`)
        }
        return await model.update({
            where: { id },
            data,
        })
    }
    catch (error)
    {
        console.error(`Error updating ${modelName}:`, error)
        throw error
    }
}

/**
 * Deletes a record from a table
 * @param [in] prisma - Prisma client instance
 * @param [in] modelName - Model name
 * @param [in] id - Record ID
 * @returns [out] Deleted record
 */
export async function deleteRecord(
    prisma: PrismaClient,
    modelName: string,
    id: string
): Promise<any>
{
    try
    {
        const model = (prisma as any)[modelName]
        if (!model)
        {
            throw new Error(`Model ${modelName} not found`)
        }
        return await model.delete({
            where: { id },
        })
    }
    catch (error)
    {
        console.error(`Error deleting ${modelName}:`, error)
        throw error
    }
}
