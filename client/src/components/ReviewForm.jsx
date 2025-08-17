import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'

export default function ReviewForm({ productSlug, onReviewAdded }) {
  const { isLoggedIn, user } = useAuth()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isLoggedIn) {
    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: 8,
        padding: 20,
        textAlign: 'center',
        marginTop: 20
      }}>
        <p style={{ margin: 0, color: '#6c757d' }}>
          Please <strong>login</strong> to leave a review
        </p>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`http://localhost:4000/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: Number(rating),
          comment: comment.trim(),
          userEmail: user.email
        }),
      })

      if (response.ok) {
        const newReview = await response.json()
        setComment('')
        setRating(5)
        onReviewAdded?.(newReview)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit review')
      }
    } catch (error) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: '#324f6bff',
      border: '1px solid #dee2e6',
      borderRadius: 8,
      padding: 20,
      marginTop: 20
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: 4,
            padding: 12,
            marginBottom: 16,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Rating
          </label>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: star <= rating ? '#ffc107' : '#e9ecef',
                  padding: 0
                }}
              >
                ⭐
              </button>
            ))}
            <span style={{ marginLeft: 8, color: '#6c757d' }}>
              {rating} star{rating !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            Comment (minimum 10 characters)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ced4da',
              borderRadius: 4,
              fontSize: 14,
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            placeholder="Share your thoughts about this product..."
            required
            minLength={10}
          />
          <small style={{ color: '#6c757d' }}>
            {comment.length}/10 characters minimum
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || comment.trim().length < 10}
          style={{
            padding: '10px 20px',
            backgroundColor: loading || comment.trim().length < 10 ? '#63c78cff' : '#385169ff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 500,
            cursor: loading || comment.trim().length < 10 ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
