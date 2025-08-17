import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct } from '../api'
import { addToCart } from '../cart'
import ReviewForm from '../components/ReviewForm.jsx'
import ReviewList from '../components/ReviewList.jsx'

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

    const handleReviewAdded = (newReview) => {
        setP(prevProduct => ({
            ...prevProduct,
            reviews: [newReview, ...prevProduct.reviews],
            reviewCount: prevProduct.reviewCount + 1,
            avgRating: prevProduct.reviews.length > 0 
                ? (prevProduct.avgRating * prevProduct.reviewCount + newReview.rating) / (prevProduct.reviewCount + 1)
                : newReview.rating
        }))
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                style={{
                    color: i < Math.round(rating) ? '#ffc107' : '#e9ecef',
                    fontSize: 18
                }}
            >
                ⭐
            </span>
        ))
    }

    if (loading) return <p>Loading…</p>
    if (!p) return <p>Not found</p>

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 32, alignItems: 'start', marginBottom: 40 }}>
                <img src={p.imageUrl} alt={p.title} style={{ width: '100%', maxHeight: '400px', borderRadius: 8, objectFit: 'cover' }} />
                <div>
                    <h2 style={{ margin: '0 0 8px 0' }}>{p.title}</h2>
                    
                    {/* Rating Display */}
                    {p.reviewCount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ display: 'flex' }}>
                                {renderStars(p.avgRating)}
                            </div>
                            <span style={{ color: '#6c757d', fontSize: 14 }}>
                                {p.avgRating.toFixed(1)} ({p.reviewCount} review{p.reviewCount !== 1 ? 's' : ''})
                            </span>
                        </div>
                    )}
                    
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

            {/* Reviews Section */}
            <div style={{ borderTop: '1px solid #dee2e6', paddingTop: 40 }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: 24 }}>Reviews & Ratings</h2>
                
                <ReviewForm 
                    productSlug={slug} 
                    onReviewAdded={handleReviewAdded} 
                />
                
                <ReviewList reviews={p.reviews || []} />
            </div>
        </div>
    )
}
