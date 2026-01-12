import { prisma } from '@/lib/prisma'

async function getNotes()
{
    try
    {
        const notes = await prisma.note.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
        return notes
    }
    catch (error)
    {
        console.error('Error fetching notes:', error)
        return []
    }
}

export default async function Home()
{
    const notes = await getNotes()

    return (
        <main style={{
            minHeight: '100vh',
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                marginBottom: '2rem',
                color: '#333',
            }}>
                BookStore
            </h1>

            <div style={{
                marginBottom: '2rem',
                padding: '1rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: '#555',
                }}>
                    Notes from Database
                </h2>

                {notes.length === 0 ? (
                    <p style={{ color: '#888' }}>
                        No notes found. Run &quot;npm run db:seed&quot; to add sample data.
                    </p>
                ) : (
                    <ul style={{
                        listStyle: 'none',
                        display: 'grid',
                        gap: '1rem',
                    }}>
                        {notes.map((note) => (
                            <li
                                key={note.id}
                                style={{
                                    padding: '1rem',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                <h3 style={{
                                    fontSize: '1.2rem',
                                    marginBottom: '0.5rem',
                                    color: '#333',
                                }}>
                                    {note.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#888',
                                }}>
                                    Created: {new Date(note.createdAt).toLocaleString()}
                                </p>
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: '#aaa',
                                    fontFamily: 'monospace',
                                    marginTop: '0.5rem',
                                }}>
                                    ID: {note.id}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#e8f4f8',
                borderRadius: '8px',
            }}>
                <h3 style={{
                    fontSize: '1.2rem',
                    marginBottom: '0.5rem',
                    color: '#555',
                }}>
                    Database Status
                </h3>
                <p style={{ color: '#666' }}>
                    {notes.length > 0
                        ? `✓ Connected to NeonDB. Found ${notes.length} note(s).`
                        : '⚠ Database connection successful, but no notes found.'}
                </p>
            </div>
        </main>
    )
}
