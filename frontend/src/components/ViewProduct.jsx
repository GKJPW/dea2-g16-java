import { useState, useEffect } from 'react'
import axios from 'axios'

// 🟢 NEW: Accept globalDiscount prop
const ViewProduct = ({ productId, onNavigate, currentUser, globalDiscount }) => {
  const [product, setProduct] = useState(null)
  const [stock, setStock] = useState(null)
  const [reviews, setReviews] = useState([])
  const [filterStar, setFilterStar] = useState('ALL')
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [adminReplies, setAdminReplies] = useState({})

  useEffect(() => {
    if (productId) {
      fetchProductDetails()
      fetchReviews()
    }
  }, [productId])

  const fetchProductDetails = async () => {
    try {
      const prodRes = await axios.get(`http://localhost:8080/api/products/${productId}`)
      setProduct(prodRes.data)
      try {
        const invRes = await axios.get(`http://localhost:8080/api/inventory/${productId}`)
        setStock(invRes.data ? invRes.data.stockQuantity : 0)
      } catch { setStock(0) }
    } catch (error) { console.error("Failed to fetch details") }
  }

  const fetchReviews = async () => {
    try {
      const revRes = await axios.get(`http://localhost:8080/api/reviews/${productId}`)
      setReviews(revRes.data)
    } catch (error) { console.error("Failed to fetch reviews") }
  }

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:8080/api/carts', {
        userId: currentUser.id, productId: productId, quantity: 1
      })
      alert("✅ Added to Cart!")
    } catch (error) { alert("Failed to add to cart.") }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!newReview.comment.trim()) return alert("Please write a comment!")
    try {
      await axios.post('http://localhost:8080/api/reviews', {
        productId: productId, userId: currentUser.id, userName: currentUser.name, 
        rating: newReview.rating, comment: newReview.comment, timestamp: new Date().toISOString() 
      })
      await axios.post('http://localhost:8080/api/notifications', {
        type: 'ADDED', message: `Your Review on [ID: ${productId}] ${product.name} was Posted Successfully!`, recipient: currentUser.id.toString() 
      })
      alert("⭐ Review submitted successfully!")
      setNewReview({ comment: '', rating: 5 }) 
      fetchReviews() 
    } catch (error) { alert("Failed to submit review.") }
  }

  const handleAdminReplySubmit = async (reviewId) => {
    const replyText = adminReplies[reviewId]
    if (!replyText || !replyText.trim()) return
    try {
      await axios.put(`http://localhost:8080/api/reviews/${reviewId}/reply`, { reply: replyText })
      alert("💬 Reply posted successfully!")
      setAdminReplies({...adminReplies, [reviewId]: ''})
      fetchReviews()
    } catch (error) { alert("Failed to post reply.") }
  }

  const getReviewColorStyle = (rating) => {
    switch (rating) {
      case 5: return { border: '#4CAF50', bg: '#1b3320', stars: '⭐⭐⭐⭐⭐' } 
      case 4: return { border: '#2196F3', bg: '#102a43', stars: '⭐⭐⭐⭐' } 
      case 3: return { border: '#FFC107', bg: '#332a04', stars: '⭐⭐⭐' } 
      case 2: return { border: '#FF9800', bg: '#332004', stars: '⭐⭐' } 
      case 1: return { border: '#F44336', bg: '#331412', stars: '⭐' } 
      default: return { border: '#555', bg: '#222', stars: '' }
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Time Pending'; 
    let utcMs;
    if (Array.isArray(timestamp)) {
      utcMs = Date.UTC(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3] || 0, timestamp[4] || 0, timestamp[5] || 0);
    } else {
      let timeStr = timestamp;
      if (!timeStr.endsWith('Z')) timeStr += 'Z'; 
      utcMs = new Date(timeStr).getTime();
    }
    const sriLankaOffsetMs = (5 * 60 + 30) * 60 * 1000;
    const lkDateObj = new Date(utcMs + sriLankaOffsetMs);

    const year = lkDateObj.getUTCFullYear();
    const month = String(lkDateObj.getUTCMonth() + 1).padStart(2, '0');
    const day = String(lkDateObj.getUTCDate()).padStart(2, '0');
    const hours = String(lkDateObj.getUTCHours()).padStart(2, '0');
    const minutes = String(lkDateObj.getUTCMinutes()).padStart(2, '0');
    const seconds = String(lkDateObj.getUTCSeconds()).padStart(2, '0');

    return `${year} / ${month} / ${day} - ${hours} : ${minutes} : ${seconds}`;
  }

  if (!product) return <p style={{ textAlign: 'center', color: '#aaa', marginTop: '50px' }}>Loading Product Details...</p>
  const isOutOfStock = stock === 0
  let displayReviews = [...reviews].sort((a, b) => b.id - a.id)
  if (filterStar !== 'ALL') displayReviews = displayReviews.filter(r => r.rating === parseInt(filterStar))

  // 🟢 NEW: Math Engine
  const finalPrice = globalDiscount?.isActive 
    ? product.price - (product.price * (globalDiscount.discountPercentage / 100))
    : product.price

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
      <button onClick={() => onNavigate('store')} style={{ marginBottom: '20px', backgroundColor: '#333', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🔙 Back to Storefront</button>

      <div style={{ display: 'flex', gap: '30px', backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #444', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '450px', aspectRatio: '3 / 2', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
          <img src={product.imageUrl || "https://placehold.co/600x400/2a2a2a/ffffff?text=No+Image"} alt={product.name} onError={(e) => { e.target.src = "https://placehold.co/600x400/crimson/ffffff?text=Broken+Link" }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div style={{ flex: '1.5', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '14px', backgroundColor: '#333', padding: '5px 10px', borderRadius: '5px', color: '#aaa', alignSelf: 'flex-start', marginBottom: '15px' }}>{product.category || 'Uncategorized'}</span>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '32px' }}>{product.name}</h2>
          <p style={{ color: '#ccc', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>{product.description}</p>
          
          {/* 🟢 NEW: Promotional Math and UI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px' }}>
            {globalDiscount?.isActive ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <h1 style={{ color: '#4CAF50', margin: 0, fontSize: '36px' }}>${finalPrice.toFixed(2)}</h1>
                  <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '20px' }}>${product.price.toFixed(2)}</span>
                </div>
            ) : (
                <h1 style={{ color: '#646cff', margin: 0, fontSize: '36px' }}>${product.price.toFixed(2)}</h1>
            )}
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: isOutOfStock ? '#ff4d4d' : '#4CAF50' }}>
              {stock === null ? '⏳ Loading stock...' : (isOutOfStock ? '❌ Out of Stock' : `📦 ${stock} in stock`)}
            </div>
          </div>

          {/* 🟢 NEW: Localized Discount Text Box */}
          {globalDiscount?.isActive && (
            <div style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)', border: '1px dashed #d97706', color: '#f59e0b', padding: '10px 15px', borderRadius: '5px', marginBottom: '20px', fontWeight: 'bold', display: 'inline-block', alignSelf: 'flex-start' }}>
                🏷️ {globalDiscount.discountMessage} — ({globalDiscount.discountPercentage}% OFF)
            </div>
          )}

          {currentUser?.role === 'USER' ? (
            <button onClick={handleAddToCart} disabled={isOutOfStock} style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', backgroundColor: isOutOfStock ? '#444' : '#646cff', color: isOutOfStock ? '#888' : 'white', fontSize: '18px', fontWeight: 'bold', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}>
                {isOutOfStock ? 'Sold Out' : '🛒 Add to Cart'}
            </button>
          ) : (
            <div style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px dashed #555', backgroundColor: 'transparent', color: '#888', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', boxSizing: 'border-box' }}>🛠️ Admin View Mode</div>
          )}
        </div>
      </div>

      {currentUser?.role === 'USER' && (
        <div style={{ backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '12px', border: '1px solid #444', marginBottom: '40px' }}>
            <h2>📝 Write a Review</h2>
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#222', color: '#aaa' }}>
                Reviewing as: <strong style={{ color: 'white' }}>{currentUser?.name || 'User'}</strong>
                </div>
                <select value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', fontWeight: 'bold' }}>
                <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                <option value={3}>3 Stars ⭐⭐⭐</option>
                <option value={2}>2 Stars ⭐⭐</option>
                <option value={1}>1 Star ⭐</option>
                </select>
            </div>
            <textarea value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} placeholder="What did you think about this product?" required rows="4" style={{ padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', resize: 'vertical' }}/>
            <button type="submit" style={{ padding: '12px', backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', alignSelf: 'flex-start' }}>Post Review</button>
            </form>
        </div>
      )}

      <div style={{ backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #444' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>💬 Customer Reviews ({displayReviews.length})</h2>
            <select value={filterStar} onChange={(e) => setFilterStar(e.target.value)} style={{ padding: '8px 15px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}>
                <option value="ALL">All Reviews</option>
                <option value="5">5 Stars Only</option>
                <option value="4">4 Stars Only</option>
                <option value="3">3 Stars Only</option>
                <option value="2">2 Stars Only</option>
                <option value="1">1 Star Only</option>
            </select>
        </div>
        
        <div style={{ maxHeight: '700px', overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {displayReviews.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}>No reviews found for this criteria.</p>
          ) : (
            displayReviews.map(review => {
              const styles = getReviewColorStyle(review.rating)
              return (
                <div key={review.id} style={{ backgroundColor: styles.bg, borderLeft: `6px solid ${styles.border}`, padding: '20px', borderRadius: '8px', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '16px' }}>👤 {review.userName}</strong>
                    <span style={{ color: '#aaa', fontSize: '13px', fontWeight: 'bold' }}>{formatDateTime(review.timestamp)}</span>
                  </div>
                  <div style={{ marginBottom: '10px', fontSize: '18px' }}>{styles.stars}</div>
                  <p style={{ margin: 0, color: 'white', lineHeight: '1.5' }}>"{review.comment}"</p>

                  {review.adminReply && (
                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderLeft: '4px solid #555', borderRadius: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
                            <span style={{ backgroundColor: '#646cff', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>OMNICART</span>
                            <span style={{ color: '#aaa', fontSize: '12px', fontWeight: 'bold' }}>{formatDateTime(review.adminReplyTimestamp)}</span>
                        </div>
                        <p style={{ margin: 0, color: 'white', fontSize: '15px', fontStyle: 'italic', lineHeight: '1.5' }}>"{review.adminReply}"</p>
                    </div>
                  )}

                  {currentUser?.role === 'ADMIN' && !review.adminReply && (
                      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '5px' }}>
                          <input type="text" value={adminReplies[review.id] || ''} onChange={(e) => setAdminReplies({...adminReplies, [review.id]: e.target.value})} placeholder="Write a response to the customer..." style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
                          <button onClick={() => handleAdminReplySubmit(review.id)} style={{ padding: '10px 20px', backgroundColor: '#646cff', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>💬 Reply</button>
                      </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ViewProduct