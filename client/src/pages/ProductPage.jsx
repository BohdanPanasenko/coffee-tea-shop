import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct } from '../api'

export default function ProductPage() {
    const { slug } = useParams()
    const [p, setP] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchProduct(slug).then(setP).finally(() => setLoading(false))
    }, [slug])

    if (loading) return <p>Loading…</p>
    if (!p) return <p>Not found</p>

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <img src={p.imageUrl} alt={p.title} style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }} />
            <div>
                <h2>{p.title}</h2>
                <div style={{ opacity: 0.7, marginBottom: 8 }}>{p.category?.name}</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>${(p.priceCents / 100).toFixed(2)}</div>
                <p style={{ marginTop: 12 }}>{p.description}</p>
                <Link to="/" style={{ display: 'inline-block', marginTop: 16 }}>← Back to catalog</Link>
            </div>
        </div>
    )
}
