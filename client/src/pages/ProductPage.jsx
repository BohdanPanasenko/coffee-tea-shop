import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct } from '../api'
import { addToCart } from '../cart'

export default function ProductPage()
{
    const { slug } = useParams()
    const [p, setP] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showAddedMessage, setShowAddedMessage] = useState(false)

    useEffect(() => 
    {
        setLoading(true)
        fetchProduct(slug).then(setP).finally(() => setLoading(false))
    }, [slug])

    const handleAddToCart = () =>
    {
        addToCart(p, 1)
        setShowAddedMessage(true)
        setTimeout(() => setShowAddedMessage(false), 2000) 
    }

    if (loading) return <p>Loading…</p>
    if (!p) return <p>Not found</p>

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 32, alignItems: 'start' }}>
            <img src={p.imageUrl} alt={p.title} style={{ width: '100%', maxHeight: '400px', borderRadius: 8, objectFit: 'cover' }} />
            <div>
                <h2>{p.title}</h2>
                <div style={{ opacity: 0.7, marginBottom: 8 }}>{p.category?.name}</div>
                <div style={{ fontWeight: 700, fontSize: 20 }}>${(p.priceCents / 100).toFixed(2)}</div>
                <p style={{ marginTop: 12 }}>{p.description}</p>
                <div style={{ marginTop: 16 }}>
                    <button onClick={handleAddToCart} style={{ marginBottom: 12, display: 'block' }}>Add to Cart</button>
                    {showAddedMessage && (
                        <div style={{
                            color: '#22c55e',
                            fontWeight: '500',
                            marginBottom: 8,
                            padding: '8px 12px',
                            backgroundColor: '#dcfce7',
                            border: '1px solid #22c55e',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}>
                            ✓ Added to cart!
                        </div>
                    )}
                    <Link to="/cart" style={{ display: 'block', marginBottom: 16 }}>Go to cart →</Link>
                </div>
                <Link to="/" style={{ display: 'inline-block', marginTop: 0 }}>← Back to catalog</Link>
            </div>
        </div>
    )
}
