import { useState, useEffect } from 'react'
import axios from 'axios'

const CATEGORIES = [
  "All Categories", "Electronics & Gadgets", "Computers & Accessories", "Women's Fashion", 
  "Men's Fashion", "Kids, Baby & Maternity", "Home, Furniture & Appliances", 
  "Kitchen & Dining", "Health, Wellness & Medical", "Beauty & Personal Care", 
  "Sports, Fitness & Outdoors", "Grocery & Gourmet Food", "Pet Supplies", 
  "Toys, Games & Hobbies", "Books & Magazines", "Movies, Music & Entertainment", 
  "Video Games & Consoles", "Tools & Home Improvement", "Automotive & Powersports", 
  "Office & School Supplies", "Arts, Crafts & Sewing", "Industrial & Scientific", 
  "Digital Products & Software", "Subscriptions & Services", "Gift Cards & Vouchers"
]

// 🟢 NEW: Accept globalDiscount prop
const ProductList = ({ onNavigate, currentUser, globalDiscount }) => {
  const [masterProducts, setMasterProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [inventoryMap, setInventoryMap] = useState({})
  const [hoveredProduct, setHoveredProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterResults()
  }, [searchTerm, selectedCategory, masterProducts])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products')
      const products = response.data
      setMasterProducts(products)
      fetchInventoryForProducts(products)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const fetchInventoryForProducts = async (products) => {
    const newInventoryMap = {}
    await Promise.all(products.map(async (p) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/inventory/${p.id}`)
        newInventoryMap[p.id] = res.data ? res.data.stockQuantity : 0
      } catch (err) {
        newInventoryMap[p.id] = 0
      }
    }))
    setInventoryMap(newInventoryMap)
  }

  const filterResults = () => {
    let results = masterProducts
    if (selectedCategory !== 'All Categories') {
      results = results.filter(p => p.category === selectedCategory)
    }
    if (searchTerm !== '') {
      results = results.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredProducts(results)
  }

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('http://localhost:8080/api/carts', {
        userId: currentUser.id, 
        productId: productId, 
        quantity: 1
      })
      const btn = document.getElementById(`btn-${productId}`)
      const originalText = btn.innerText
      btn.innerText = "✅ Added!"
      btn.style.backgroundColor = "#4CAF50"
      setTimeout(() => {
        btn.innerText = originalText
        btn.style.backgroundColor = "#646cff"
      }, 1500)
    } catch (error) {
      alert("Failed to add to cart.")
    }
  }

  const getStockBadge = (productId) => {
    const stock = inventoryMap[productId]
    if (stock === undefined) return <span style={{ color: '#aaa', fontSize: '13px' }}>⏳ Loading...</span>
    if (stock === 0) return <span style={{ color: '#ff4d4d', fontSize: '13px', fontWeight: 'bold' }}>❌ Out of Stock</span>
    if (stock <= 5) return <span style={{ color: '#ffa500', fontSize: '13px', fontWeight: 'bold' }}>⚠️ Only {stock} left!</span>
    return <span style={{ color: '#4CAF50', fontSize: '13px', fontWeight: 'bold' }}>📦 {stock} in stock</span>
  }

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="🔍 Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 2, padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white', minWidth: '200px' }} />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ flex: 1, padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#2a2a2a', color: 'white', minWidth: '200px' }}>
          {CATEGORIES.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '30px' }}>
        {filteredProducts.map((product) => {
          const isOutOfStock = inventoryMap[product.id] === 0
          const isHovered = hoveredProduct === product.id 
          
          // 🟢 NEW: Math Engine for the active discount
          const finalPrice = globalDiscount?.isActive 
            ? product.price - (product.price * (globalDiscount.discountPercentage / 100))
            : product.price

          return (
            <div key={product.id} style={{ border: '1px solid #444', borderRadius: '12px', backgroundColor: '#1a1a1a', color: 'white', overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: isOutOfStock ? 0.7 : 1 }}>
              <div style={{ aspectRatio: '3 / 2', width: '100%', backgroundColor: '#000', position: 'relative' }}>
                <img src={product.imageUrl || "https://placehold.co/600x400/2a2a2a/ffffff?text=No+Image"} alt={product.name} onError={(e) => { e.target.src = "https://placehold.co/600x400/crimson/ffffff?text=Broken+Link" }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', backgroundColor: '#333', padding: '4px 8px', borderRadius: '4px', color: '#aaa' }}>{product.category || 'Uncategorized'}</span>
                    {getStockBadge(product.id)}
                  </div>
                  
                  <h3 
                    onClick={() => onNavigate('viewProduct', product.id)}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    style={{ 
                        margin: '0 0 10px 0', 
                        fontSize: '18px', 
                        lineHeight: '1.3', 
                        cursor: 'pointer', 
                        color: isHovered ? '#646cff' : 'white', 
                        transition: 'all 0.2s ease-in-out',
                        transform: isHovered ? 'scale(1.02) translateX(3px)' : 'scale(1) translateX(0px)'
                    }}
                  >
                    {product.name}
                  </h3>
                  
                  <p style={{ fontSize: '14px', color: '#ccc', margin: '0 0 15px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>
                </div>
                <div>
                  
                  {/* 🟢 NEW: Promotional Price Rendering */}
                  <div style={{ marginBottom: '15px' }}>
                    {globalDiscount?.isActive ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ color: '#4CAF50', margin: 0 }}>${finalPrice.toFixed(2)}</h2>
                        <span style={{ textDecoration: 'line-through', color: '#888', fontSize: '14px' }}>${product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <h2 style={{ color: '#646cff', margin: 0 }}>${product.price.toFixed(2)}</h2>
                    )}
                  </div>

                  {currentUser?.role === 'USER' ? (
                    <button id={`btn-${product.id}`} onClick={() => handleAddToCart(product.id)} disabled={isOutOfStock} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: isOutOfStock ? '#444' : '#646cff', color: isOutOfStock ? '#888' : 'white', fontWeight: 'bold', cursor: isOutOfStock ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s' }}>
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                  ) : (
                    <div style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px dashed #555', backgroundColor: 'transparent', color: '#888', fontWeight: 'bold', textAlign: 'center', boxSizing: 'border-box' }}>
                        🛠️ Admin View Mode
                    </div>
                  )}

                </div>
              </div>
            </div>
          )
        })}
      </div>
      {filteredProducts.length === 0 && <p style={{ textAlign: 'center', color: '#aaa', marginTop: '40px' }}>No products found.</p>}
    </div>
  )
}

export default ProductList