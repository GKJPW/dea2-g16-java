import { useState, useEffect } from 'react'
import axios from 'axios'

const CATEGORIES = [
  "Electronics & Gadgets", "Computers & Accessories", "Women's Fashion", 
  "Men's Fashion", "Kids, Baby & Maternity", "Home, Furniture & Appliances", 
  "Kitchen & Dining", "Health, Wellness & Medical", "Beauty & Personal Care", 
  "Sports, Fitness & Outdoors", "Grocery & Gourmet Food", "Pet Supplies", 
  "Toys, Games & Hobbies", "Books & Magazines", "Movies, Music & Entertainment", 
  "Video Games & Consoles", "Tools & Home Improvement", "Automotive & Powersports", 
  "Office & School Supplies", "Arts, Crafts & Sewing", "Industrial & Scientific", 
  "Digital Products & Software", "Subscriptions & Services", "Gift Cards & Vouchers"
]

const AdminDashboard = () => {
  const [products, setProducts] = useState([])
  const [inventoryMap, setInventoryMap] = useState({})

  // 1. Publish State
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: ''
  })
  
  // 2. Restock & Delete State
  const [restockData, setRestockData] = useState({ productId: '', quantity: '' })
  const [deleteProductId, setDeleteProductId] = useState('')

  // 🟢 3. NEW: Edit Product State
  const [editProductId, setEditProductId] = useState('')
  const [editFormData, setEditFormData] = useState({
    name: '', description: '', price: '', category: '', imageUrl: ''
  })

  // 🟢 4. NEW: Global Discount State
  const [discountData, setDiscountData] = useState({
    isActive: false, discountPercentage: 0, discountMessage: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchGlobalDiscount() // Fetch discount config on load
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products')
      setProducts(response.data)
      fetchInventoryForProducts(response.data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const fetchInventoryForProducts = async (productsData) => {
    const newInventoryMap = {}
    await Promise.all(productsData.map(async (p) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/inventory/${p.id}`)
        newInventoryMap[p.id] = res.data ? res.data.stockQuantity : 0
      } catch (err) {
        newInventoryMap[p.id] = 0 
      }
    }))
    setInventoryMap(newInventoryMap)
  }

  const fetchGlobalDiscount = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products/discount')
      if (response.data) {
        setDiscountData(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch discount state", error)
    }
  }

  // --- PUBLISH HANDLERS ---
  const handlePublishChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handlePublishSubmit = async (e) => {
    e.preventDefault() 
    if (formData.category === "") return alert("⚠️ Please select a valid product category.")
    try {
      const res = await axios.post('http://localhost:8080/api/products', {
        name: formData.name, description: formData.description, price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity), category: formData.category, imageUrl: formData.imageUrl
      })
      await axios.put(`http://localhost:8080/api/inventory/${res.data.id}/restock?quantity=${formData.stockQuantity}`)
      await axios.post('http://localhost:8080/api/notifications', {
        type: 'ADDED', message: `[ID: ${res.data.id}] ${res.data.name} was successfully published.`, recipient: 'ADMIN'
      })
      alert("✅ Product successfully published!")
      setFormData({ name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' })
      fetchProducts() 
    } catch (error) { alert("❌ Failed to publish product.") }
  }

  // --- RESTOCK HANDLERS ---
  const handleRestockChange = (e) => setRestockData({ ...restockData, [e.target.name]: e.target.value })
  const handleRestockSubmit = async (e) => {
    e.preventDefault()
    if (restockData.productId === "") return alert("⚠️ Please select a product.")
    try {
      await axios.put(`http://localhost:8080/api/inventory/${restockData.productId}/restock?quantity=${restockData.quantity}`)
      alert("📦 Inventory successfully replenished!")
      setRestockData({ productId: '', quantity: '' })
      fetchProducts() 
    } catch (error) { alert("❌ Failed to restock product.") }
  }

  // --- DELETE HANDLER ---
  const handleDeleteSubmit = async (e) => {
    e.preventDefault()
    if (deleteProductId === "") return alert("⚠️ Please select a product.")
    if (!window.confirm("Are you absolutely sure you want to permanently delete this product?")) return
    try {
      await axios.delete(`http://localhost:8080/api/products/${deleteProductId}`)
      alert("🗑️ Product successfully deleted!")
      setDeleteProductId('')
      fetchProducts() 
    } catch (error) { alert("❌ Failed to delete product. It might be linked to existing order records.") }
  }

  // 🟢 NEW: EDIT HANDLERS
  const handleEditSelectChange = (e) => {
    const id = e.target.value
    setEditProductId(id)
    const product = products.find(p => p.id === parseInt(id))
    if (product) {
      setEditFormData({
        name: product.name, description: product.description, price: product.price, 
        category: product.category, imageUrl: product.imageUrl
      })
    }
  }
  const handleEditFormChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editProductId) return alert("⚠️ Please select a product to edit.")
    try {
      await axios.put(`http://localhost:8080/api/products/${editProductId}`, {
        name: editFormData.name, description: editFormData.description, 
        price: parseFloat(editFormData.price), category: editFormData.category, imageUrl: editFormData.imageUrl
      })
      alert("✏️ Product details updated successfully!")
      setEditProductId('')
      setEditFormData({ name: '', description: '', price: '', category: '', imageUrl: '' })
      fetchProducts()
    } catch (error) { alert("❌ Failed to update product details.") }
  }

  // 🟢 NEW: DISCOUNT HANDLERS
  const handleDiscountSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put('http://localhost:8080/api/products/discount', discountData)
      
      // Send a notification to Admin channel so they have a record of turning it on/off
      await axios.post('http://localhost:8080/api/notifications', {
        type: 'ADDED', 
        message: discountData.isActive ? `Global Discount Activated: ${discountData.discountPercentage}% OFF` : `Global Discount Deactivated.`,
        recipient: 'ADMIN'
      })

      alert(`🏷️ Promotional settings successfully ${discountData.isActive ? 'activated' : 'deactivated'}!`)
    } catch (error) { alert("❌ Failed to save discount settings.") }
  }

  const renderProductOptions = () => {
    return products.map(product => {
      const stock = inventoryMap[product.id]
      let stockLabel = "⏳ Loading..."
      let colorCode = "#ffffff" 
      if (stock !== undefined) {
        if (stock === 0) { stockLabel = "❌ 0 in stock"; colorCode = "#ff4d4d" } 
        else if (stock <= 5) { stockLabel = `⚠️ ${stock} in stock`; colorCode = "#f59e0b" } 
        else { stockLabel = `📦 ${stock} in stock`; colorCode = "#4CAF50" }
      }
      return (
        <option key={product.id} value={product.id} style={{ color: colorCode, fontWeight: 'bold', backgroundColor: '#222' }}>
          [ID: {product.id}] {product.name} ({stockLabel})
        </option>
      )
    })
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
      
      {/* 🟢 THE NEW DISCOUNT ENGINE PANEL */}
      <div style={{ backgroundColor: '#2b220b', padding: '30px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #735a11' }}>
        <h2 style={{ color: '#f59e0b', margin: '0 0 5px 0' }}>🏷️ Global Discount Engine</h2>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>Apply a system-wide discount to all products instantly.</p>
        
        <form onSubmit={handleDiscountSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#1a1405', padding: '15px', borderRadius: '8px', border: '1px solid #4a3a0a' }}>
            <strong style={{ color: 'white', fontSize: '18px' }}>Status:</strong>
            <button 
              type="button" 
              onClick={() => setDiscountData({...discountData, isActive: !discountData.isActive})}
              style={{ 
                padding: '8px 20px', 
                backgroundColor: discountData.isActive ? '#4CAF50' : '#444', 
                color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '20px', cursor: 'pointer', transition: '0.3s'
              }}
            >
              {discountData.isActive ? "🟢 ACTIVE" : "⚫ INACTIVE"}
            </button>
            <span style={{ color: '#888', fontSize: '14px', marginLeft: 'auto' }}>Toggle to apply to storefront</span>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '14px' }}>Discount Percentage (%)</label>
                <input type="number" min="0" max="100" value={discountData.discountPercentage} onChange={(e) => setDiscountData({...discountData, discountPercentage: parseFloat(e.target.value)})} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', fontSize: '18px', fontWeight: 'bold' }}/>
            </div>
            <div style={{ flex: 3 }}>
                <label style={{ display: 'block', color: '#ccc', marginBottom: '5px', fontSize: '14px' }}>Promotional Banner Message</label>
                <input type="text" placeholder="e.g., Weekend Deal! Everything is discounted!" value={discountData.discountMessage} onChange={(e) => setDiscountData({...discountData, discountMessage: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', fontSize: '16px' }}/>
            </div>
          </div>

          <button type="submit" style={{ padding: '15px', backgroundColor: '#d97706', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontSize: '16px' }}>
            💾 Save Discount Rules
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #444' }}>
        <h2>✨ Publish New Product</h2>
        <form onSubmit={handlePublishSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handlePublishChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}/>
          <input type="text" name="description" placeholder="Short Description" value={formData.description} onChange={handlePublishChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}/>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" name="price" placeholder="Price ($)" step="0.01" value={formData.price} onChange={handlePublishChange} required style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}/>
            <input type="number" name="stockQuantity" placeholder="Initial Stock Qty" value={formData.stockQuantity} onChange={handlePublishChange} required style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}/>
          </div>
          <select name="category" value={formData.category} onChange={handlePublishChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}>
            <option value="" disabled>Select a Category...</option>
            {CATEGORIES.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
          </select>
          <input type="url" name="imageUrl" placeholder="Image URL (e.g., https://example.com/image.jpg)" value={formData.imageUrl} onChange={handlePublishChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}/>
          <button type="submit" style={{ padding: '15px', backgroundColor: '#646cff', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            📤 Publish Product
          </button>
        </form>
      </div>

      {/* 🟢 THE NEW EDIT PRODUCT PANEL */}
      <div style={{ backgroundColor: '#1e1b4b', padding: '30px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #312e81' }}>
        <h2 style={{ color: '#818cf8', margin: '0 0 5px 0' }}>✏️ Edit Product Details</h2>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>Update information, pricing, or images for an existing product.</p>
        
        <select value={editProductId} onChange={handleEditSelectChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', marginBottom: '20px' }}>
          <option value="" disabled>Select a Product to Edit...</option>
          {renderProductOptions()}
        </select>

        {editProductId && (
          <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #444' }}>
            <label style={{ color: '#ccc', fontSize: '12px', marginBottom: '-10px' }}>Product Name</label>
            <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}/>
            
            <label style={{ color: '#ccc', fontSize: '12px', marginBottom: '-10px' }}>Description</label>
            <input type="text" name="description" value={editFormData.description} onChange={handleEditFormChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}/>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ color: '#ccc', fontSize: '12px', marginBottom: '5px' }}>Price ($)</label>
                <input type="number" name="price" step="0.01" value={editFormData.price} onChange={handleEditFormChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}/>
              </div>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                <label style={{ color: '#ccc', fontSize: '12px', marginBottom: '5px' }}>Category</label>
                <select name="category" value={editFormData.category} onChange={handleEditFormChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}>
                  {CATEGORIES.map((cat, index) => <option key={index} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <label style={{ color: '#ccc', fontSize: '12px', marginBottom: '-10px' }}>Image URL</label>
            <input type="url" name="imageUrl" value={editFormData.imageUrl} onChange={handleEditFormChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#222', color: 'white' }}/>
            
            <button type="submit" style={{ padding: '15px', backgroundColor: '#4f46e5', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              💾 Save Updated Details
            </button>
          </form>
        )}
      </div>

      <div style={{ backgroundColor: '#2a2a2a', padding: '30px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #444' }}>
        <h2>📦 Warehouse Restock</h2>
        <form onSubmit={handleRestockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <select name="productId" value={restockData.productId} onChange={handleRestockChange} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}>
            <option value="" disabled>Select a Product to Restock...</option>
            {renderProductOptions()}
          </select>
          <input type="number" name="quantity" placeholder="Number of units arriving..." value={restockData.quantity} onChange={handleRestockChange} required min="1" style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}/>
          <button type="submit" style={{ padding: '15px', backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            ➕ Add to Stock
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: '#3a1e1e', padding: '30px', borderRadius: '10px', border: '1px solid #662222' }}>
        <h2 style={{ color: '#ff4d4d' }}>⚠️ Danger Zone: Delete Product</h2>
        <form onSubmit={handleDeleteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <select value={deleteProductId} onChange={(e) => setDeleteProductId(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }}>
            <option value="" disabled>Select a Product to Delete...</option>
            {renderProductOptions()}
          </select>
          <button type="submit" style={{ padding: '15px', backgroundColor: '#d93025', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            🗑️ Permanently Delete Product
          </button>
        </form>
      </div>

    </div>
  )
}

export default AdminDashboard