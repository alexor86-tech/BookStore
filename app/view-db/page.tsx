'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Table
{
    name: string
    modelName: string
    count: number
}

/**
 * View DB page - allows selecting database and viewing tables
 */
export default function ViewDbPage()
{
    const router = useRouter()
    const [dbType, setDbType] = useState<'local' | 'production'>('production')
    const [tables, setTables] = useState<Table[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadTables()
    }, [dbType])

    const loadTables = async () => {
        setLoading(true)
        setError(null)
        try
        {
            const response = await fetch(`/api/db/tables?dbType=${dbType}`)
            if (!response.ok)
            {
                throw new Error('Failed to load tables')
            }
            const data = await response.json()
            setTables(data.tables || [])
        }
        catch (err: any)
        {
            setError(err.message || 'Failed to load tables')
        }
        finally
        {
            setLoading(false)
        }
    }

    const handleOpenTable = (tableName: string) => {
        router.push(`/view-db/table/${tableName}?dbType=${dbType}`)
    }

    return (
        <main style={{
            minHeight: '100vh',
            padding: '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                marginBottom: '2rem',
                color: '#333',
            }}>
                Database Viewer
            </h1>

            <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
            }}>
                <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#555',
                }}>
                    Select Database:
                </label>
                <select
                    value={dbType}
                    onChange={(e) => setDbType(e.target.value as 'local' | 'production')}
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        minWidth: '200px',
                    }}
                >
                    <option value="production">Production (Рабочая)</option>
                    <option value="local">Local (Локальная)</option>
                </select>
            </div>

            {error && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fee',
                    color: '#c33',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                }}>
                    Error: {error}
                </div>
            )}

            {loading ? (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#888',
                }}>
                    Loading tables...
                </div>
            ) : (
                <div>
                    <h2 style={{
                        fontSize: '1.8rem',
                        marginBottom: '1rem',
                        color: '#555',
                    }}>
                        Tables ({tables.length})
                    </h2>

                    {tables.length === 0 ? (
                        <p style={{ color: '#888' }}>
                            No tables found.
                        </p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gap: '1rem',
                        }}>
                            {tables.map((table) => (
                                <div
                                    key={table.name}
                                    style={{
                                        padding: '1.5rem',
                                        backgroundColor: 'white',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <h3 style={{
                                            fontSize: '1.3rem',
                                            marginBottom: '0.5rem',
                                            color: '#333',
                                        }}>
                                            {table.name}
                                        </h3>
                                        <p style={{
                                            fontSize: '0.9rem',
                                            color: '#888',
                                        }}>
                                            Records: {table.count}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenTable(table.name)}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            fontSize: '1rem',
                                            backgroundColor: '#0070f3',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0051cc'
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0070f3'
                                        }}
                                    >
                                        Открыть
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}
