import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../api'

export default function Catalog() {
    const FALLBACK_IMG = 'https://placehold.co/800x600?text=Tea'; // little prevention of broken images
    const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 12 })
    const [loading, setLoading] = useState(true)
    const [params, setParams] = useSearchParams()

    const category = params.get('category') || ''
    const query = params.get('query') || ''
    const page = Number(params.get('page') || 1)

    useEffect(() => {
        setLoading(true)
        fetchProducts({ category, query, page }).then((result) => {
            setData(result)
            if (result.total > 0) {
                const maxPage = Math.ceil(result.total / result.pageSize)
                if (page > maxPage) {
                    setParams(prev => {
                        const p = new URLSearchParams(prev);
                        p.set('page', maxPage.toString());
                        return p
                    })
                }
            }
        }).finally(() => setLoading(false))
    }, [category, query, page, setParams])

    const nextPage = () => setParams(prev => { const p = new URLSearchParams(prev); p.set('page', page + 1); return p })
    const prevPage = () => setParams(prev => { const p = new URLSearchParams(prev); p.set('page', Math.max(1, page - 1)); return p })

    // Calculate if there are more pages
    const totalPages = Math.ceil(data.total / data.pageSize)
    const hasNextPage = page < totalPages

    if (loading) return <p>Loading products…</p>
    if (!data.items.length && page === 1) return <p>No products found.</p>

    return (
        <div>
            <h2 style={{ marginBottom: 12 }}>
                {category ? category.toUpperCase() : 'All Products'}
                {query ? ` — results for “${query}”` : ''}
            </h2>
            <div style=
                {
                    {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 16
                    }
                }>
                {data.items.map(p => (
                    <Link key={p.id} to={`/product/${p.slug}`} style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
                        <img
                            src={p.imageUrl}
                            alt={p.title}
                            style={{ width: '100%', height: 200, objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                        />
                        <div style={{ padding: 12 }}>
                            <div style={{ fontWeight: 600 }}>{p.title}</div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>{p.category?.name}</div>
                            <div style={{ marginTop: 8 }}>${(p.priceCents / 100).toFixed(2)}</div>
                        </div>
                    </Link>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24 }}>
                <button
                    onClick={prevPage}
                    disabled={page <= 1}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: page <= 1 ? 'not-allowed' : 'pointer',
                        opacity: page <= 1 ? 0.3 : 1,
                        padding: '8px'
                    }}
                >
                    ←
                </button>
                <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#362424ff',
                    borderRadius: '6px',
                    fontWeight: '500',
                    minWidth: '80px',
                    textAlign: 'center'
                }}>
                    Page {data.page}
                </span>
                <button
                    onClick={nextPage}
                    disabled={!hasNextPage}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: !hasNextPage ? 'not-allowed' : 'pointer',
                        opacity: !hasNextPage ? 0.3 : 1,
                        padding: '8px'
                    }}
                >
                    →
                </button>
            </div>
        </div>
    )
}
