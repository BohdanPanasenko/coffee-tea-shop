export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
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
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < rating ? '#ffc107' : '#e9ecef',
          fontSize: 16
        }}
      >
        ⭐
      </span>
    ))
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>
        Customer Reviews ({reviews.length})
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {reviews.map((review) => (
          <div
            key={review.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #dee2e6',
              borderRadius: 8,
              padding: 16
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#385169ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14
                }}>
                  {review.user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>
                    {review.user?.name || 'Anonymous'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex' }}>
                      {renderStars(review.rating)}
                    </div>
                    <span style={{ color: '#6c757d', fontSize: 12 }}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <p style={{ 
              margin: 0, 
              lineHeight: 1.5, 
              color: '#333',
              fontSize: 14 
            }}>
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
