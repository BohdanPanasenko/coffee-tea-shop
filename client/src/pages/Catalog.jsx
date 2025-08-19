import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../api'
import '../styles/pages/catalog.css'

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

    const totalPages = Math.ceil(data.total / data.pageSize)
    const hasNextPage = page < totalPages

    if (loading) return <p>Loading products…</p>
    if (!data.items.length && page === 1) return <p>No products found.</p>

    return (
        <div>
            <h2 className="catalog-heading">
                {category ? category.toUpperCase() : 'All Products'}
                {query ? ` — results for “${query}”` : ''}
            </h2>
            <div className="catalog-grid">
                {data.items.map(p => (
                    <Link key={p.id} to={`/product/${p.slug}`} className="product-card">
                        <div className="product-card__imgwrap">
                            <img
                                src={p.imageUrl}
                                alt={p.title}
                                loading="lazy"
                                className="product-card__img"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                            />
                        </div>
                        <div className="product-card__body">
                            <div className="product-card__title">{p.title}</div>
                            <div className="product-card__category">{p.category?.name}</div>
                            <div className="product-card__price">${(p.priceCents / 100).toFixed(2)}</div>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="pager">
                <button onClick={prevPage} disabled={page <= 1} className="pager-btn" aria-label="Previous page">
                    ←
                </button>
                <span className="pager__page">
                    Page {data.page}
                </span>
                <button onClick={nextPage} disabled={!hasNextPage} className="pager-btn" aria-label="Next page">
                    →
                </button>
            </div>
        </div>
    )
}
