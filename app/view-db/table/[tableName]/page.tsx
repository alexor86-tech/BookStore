'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

interface Record
{
    [key: string]: any
}

interface Pagination
{
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
}

/**
 * Table view page - displays table data with pagination and CRUD operations
 */
export default function TableViewPage()
{
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams()
    
    const tableName = params.tableName as string
    const dbType = (searchParams.get('dbType') || 'production') as 'local' | 'production'
    
    const [data, setData] = useState<Record[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [editingRecord, setEditingRecord] = useState<Record | null>(null)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [createData, setCreateData] = useState<Record>({})

    useEffect(() => {
        loadData()
    }, [tableName, dbType, pagination.page])

    const loadData = async () => {
        setLoading(true)
        setError(null)
        try
        {
            const response = await fetch(
                `/api/db/table/${tableName}?dbType=${dbType}&page=${pagination.page}&pageSize=${pagination.pageSize}`
            )
            if (!response.ok)
            {
                throw new Error('Failed to load table data')
            }
            const result = await response.json()
            setData(result.data || [])
            setPagination(result.pagination || pagination)
        }
        catch (err: any)
        {
            setError(err.message || 'Failed to load table data')
        }
        finally
        {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?'))
        {
            return
        }

        try
        {
            const response = await fetch(
                `/api/db/table/${tableName}/delete?dbType=${dbType}&id=${id}`,
                { method: 'DELETE' }
            )
            if (!response.ok)
            {
                throw new Error('Failed to delete record')
            }
            loadData()
        }
        catch (err: any)
        {
            setError(err.message || 'Failed to delete record')
        }
    }

    const handleUpdate = async () => {
        if (!editingRecord || !editingRecord.id)
        {
            return
        }

        try
        {
            const response = await fetch(
                `/api/db/table/${tableName}/update?dbType=${dbType}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingRecord),
                }
            )
            if (!response.ok)
            {
                throw new Error('Failed to update record')
            }
            setEditingRecord(null)
            loadData()
        }
        catch (err: any)
        {
            setError(err.message || 'Failed to update record')
        }
    }

    const handleCreate = async () => {
        try
        {
            const response = await fetch(
                `/api/db/table/${tableName}/create?dbType=${dbType}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(createData),
                }
            )
            if (!response.ok)
            {
                throw new Error('Failed to create record')
            }
            setShowCreateForm(false)
            setCreateData({})
            loadData()
        }
        catch (err: any)
        {
            setError(err.message || 'Failed to create record')
        }
    }

    const getColumnNames = (): string[] => {
        if (data.length === 0)
        {
            return []
        }
        return Object.keys(data[0])
    }

    const formatValue = (value: any): string => {
        if (value === null || value === undefined)
        {
            return 'null'
        }
        if (typeof value === 'object')
        {
            return JSON.stringify(value)
        }
        if (value instanceof Date)
        {
            return value.toLocaleString()
        }
        return String(value)
    }

    return (
        <main style={{
            minHeight: '100vh',
            padding: '2rem',
            maxWidth: '1600px',
            margin: '0 auto',
        }}>
            <div style={{
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                    <button
                        onClick={() => router.push('/view-db')}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '1rem',
                        }}
                    >
                        ← Back to Tables
                    </button>
                    <h1 style={{
                        fontSize: '2.5rem',
                        color: '#333',
                    }}>
                        Table: {tableName}
                    </h1>
                    <p style={{
                        color: '#888',
                        marginTop: '0.5rem',
                    }}>
                        Database: {dbType === 'local' ? 'Local' : 'Production'}
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    {showCreateForm ? 'Cancel' : '+ Create New'}
                </button>
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

            {showCreateForm && (
                <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                }}>
                    <h3 style={{ marginBottom: '1rem' }}>Create New Record</h3>
                    <div style={{
                        display: 'grid',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                    }}>
                        {getColumnNames().map((col) => (
                            <div key={col}>
                                <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                                    {col}:
                                </label>
                                <input
                                    type="text"
                                    value={createData[col] || ''}
                                    onChange={(e) => setCreateData({
                                        ...createData,
                                        [col]: e.target.value,
                                    })}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleCreate}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Create
                    </button>
                </div>
            )}

            {loading ? (
                <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#888',
                }}>
                    Loading data...
                </div>
            ) : (
                <>
                    <div style={{
                        overflowX: 'auto',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        marginBottom: '1rem',
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                        }}>
                            <thead>
                                <tr style={{
                                    backgroundColor: '#f5f5f5',
                                }}>
                                    {getColumnNames().map((col) => (
                                        <th
                                            key={col}
                                            style={{
                                                padding: '0.75rem',
                                                textAlign: 'left',
                                                borderBottom: '2px solid #ddd',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                    <th style={{
                                        padding: '0.75rem',
                                        textAlign: 'left',
                                        borderBottom: '2px solid #ddd',
                                        fontWeight: 'bold',
                                    }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((record, idx) => (
                                    <tr key={record.id || idx} style={{
                                        borderBottom: '1px solid #eee',
                                    }}>
                                        {getColumnNames().map((col) => (
                                            <td
                                                key={col}
                                                style={{
                                                    padding: '0.75rem',
                                                    maxWidth: '300px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                                title={formatValue(record[col])}
                                            >
                                                {editingRecord?.id === record.id && editingRecord ? (
                                                    <input
                                                        type="text"
                                                        value={editingRecord[col] || ''}
                                                        onChange={(e) => setEditingRecord({
                                                            ...editingRecord,
                                                            [col]: e.target.value,
                                                        })}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.25rem',
                                                            border: '1px solid #0070f3',
                                                            borderRadius: '2px',
                                                        }}
                                                    />
                                                ) : (
                                                    formatValue(record[col])
                                                )}
                                            </td>
                                        ))}
                                        <td style={{ padding: '0.75rem' }}>
                                            {editingRecord?.id === record.id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={handleUpdate}
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: '#28a745',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingRecord(null)}
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: '#666',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => setEditingRecord({ ...record })}
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: '#0070f3',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(record.id)}
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            backgroundColor: '#dc3545',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.85rem',
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                    }}>
                        <div>
                            <span style={{ color: '#666' }}>
                                Page {pagination.page} of {pagination.totalPages} 
                                ({pagination.totalCount} total records)
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setPagination({
                                    ...pagination,
                                    page: Math.max(1, pagination.page - 1),
                                })}
                                disabled={pagination.page === 1}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: pagination.page === 1 ? '#ccc' : '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination({
                                    ...pagination,
                                    page: Math.min(pagination.totalPages, pagination.page + 1),
                                })}
                                disabled={pagination.page >= pagination.totalPages}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: pagination.page >= pagination.totalPages ? '#ccc' : '#0070f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </main>
    )
}
