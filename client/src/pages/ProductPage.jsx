import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct } from '../api'
import { addToCart } from '../cart'
import ReviewForm from '../components/ReviewForm.jsx'
import ReviewList from '../components/ReviewList.jsx'
import '../styles/pages/product.css'

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
        <div className="product-page">
            <div className="product-grid">
                <img src={p.imageUrl} alt={p.title} className="product-image" />
                <div>
                    <h2 className="product-title">{p.title}</h2>
                    
                    {/* Rating Display */}
                    {p.reviewCount > 0 && (
                        <div className="rating">
                            <div className="rating__stars">
                                {renderStars(p.avgRating)}
                            </div>
                            <span className="rating__text">
                                {p.avgRating.toFixed(1)} ({p.reviewCount} review{p.reviewCount !== 1 ? 's' : ''})
                            </span>
                        </div>
                    )}
                    
                    <div className="product-category">{p.category?.name}</div>
                    <div className="product-price">${(p.priceCents / 100).toFixed(2)}</div>
                    <p className="product-description">{p.description}</p>
                    <div className="product-actions">
                        <button onClick={handleAddToCart} className="product-add-btn">Add to Cart</button>
                        {showAddedMessage && (
                            <div className="added-msg">
                                ✓ Added to cart!
                            </div>
                        )}
                        <Link to="/cart" className="go-to-cart-link">Go to cart →</Link>
                    </div>
                    <Link to="/" className="back-link">← Back to catalog</Link>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews">
                <h2 className="reviews-title">Reviews & Ratings</h2>
                
                <ReviewForm 
                    productSlug={slug} 
                    onReviewAdded={handleReviewAdded} 
                />
                
                <ReviewList reviews={p.reviews || []} />
            </div>
        </div>
    )
}
