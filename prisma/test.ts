import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Test script that creates a test user, test book (prompt), and a vote
 */
async function main()
{
    // Create test user
    const testUser = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test User',
        },
    })

    console.log('Created test user:', testUser)

    // Create test category (required for Book)
    const testCategory = await prisma.category.create({
        data: {
            category: 'Test Category',
        },
    })

    console.log('Created test category:', testCategory)

    // Create test book (prompt)
    const testBook = await prisma.book.create({
        data: {
            title: 'Test Book Title',
            content: 'This is the content of the test book',
            description: 'Test book description',
            visibility: 'PUBLIC',
            ownerId: testUser.id,
            categoryId: testCategory.id,
        },
    })

    console.log('Created test book (prompt):', testBook)

    // Create test vote
    const testVote = await prisma.vote.create({
        data: {
            userId: testUser.id,
            bookId: testBook.id,
            value: 1,
        },
    })

    console.log('Created test vote:', testVote)

    console.log('\n✅ All test data created successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('Error:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
