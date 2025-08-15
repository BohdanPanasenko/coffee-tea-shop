import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../api'

export default function Catalog() {
    const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 12 })
    const [loading, setLoading] = useState(true)
    const [params, setParams] = useSearchParams()

    const category = params.get('category') || ''
    const query = params.get('query') || ''
    const page = Number(params.get('page') || 1)

    useEffect(() => {
        setLoading(true)
        fetchProducts({ category, query, page }).then(setData).finally(() => setLoading(false))
    }, [category, query, page])

    const nextPage = () => setParams(prev => { const p = new URLSearchParams(prev); p.set('page', page + 1); return p })
    const prevPage = () => setParams(prev => { const p = new URLSearchParams(prev); p.set('page', Math.max(1, page - 1)); return p })

    if (loading) return <p>Loading products…</p>
    if (!data.items.length) return <p>No products found.</p>

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
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 16
                    }
                }>
                {data.items.map(p => (
                    <Link key={p.id} to={`/product/${p.slug}`} style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}>
                        <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                        <div style={{ padding: 12 }}>
                            <div style={{ fontWeight: 600 }}>{p.title}</div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>{p.category?.name}</div>
                            <div style={{ marginTop: 8 }}>${(p.priceCents / 100).toFixed(2)}</div>
                        </div>
                    </Link>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button onClick={prevPage} disabled={page <= 1}>Prev</button>
                <span>Page {data.page}</span>
                <button onClick={nextPage} disabled={data.items.length < data.pageSize}>Next</button>
            </div>
        </div>
    )
}
