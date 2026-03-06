import { useState, useEffect } from 'react'
import axios from 'axios'

// 🟢 NEW: Accept globalDiscount prop
const Cart = ({ onNavigate, currentUser, globalDiscount }) => {
  const [cartItems, setCartItems] = useState([])
  const [productDirectory, setProductDirectory] = useState({}) 
  const [inventoryMap, setInventoryMap] = useState({})
  const [grandTotal, setGrandTotal] = useState(0)

  useEffect(() => {
    if (currentUser) refreshCartData()
  }, [currentUser, globalDiscount]) // 🟢 Reload if discount changes while in cart!

  const refreshCartData = async () => {
    try {
      const cartRes = await axios.get(`http://localhost:8080/api/carts/${currentUser.id}`)
      const items = cartRes.data

      const productsRes = await axios.get('http://localhost:8080/api/products')
      const products = productsRes.data

      const directory = {}
      products.forEach(p => {
        directory[p.id] = p
      })

      // 🟢 NEW: Recalculate Total applying the Discount Engine!
      let total = 0
      items.forEach(item => {
        if (directory[item.productId]) {
          const basePrice = directory[item.productId].price
          const finalPrice = globalDiscount?.isActive 
            ? basePrice - (basePrice * (globalDiscount.discountPercentage / 100))
            : basePrice
            
          total += finalPrice * item.quantity
        }
      })

      setProductDirectory(directory)
      setCartItems(items)
      setGrandTotal(total)

      fetchInventoryForCartItems(items)

    } catch (error) {
      console.error("Failed to fetch cart data:", error)
    }
  }

  const fetchInventoryForCartItems = async (items) => {
    const newInventoryMap = {}
    const uniqueProductIds = [...new Set(items.map(item => item.productId))]

    await Promise.all(uniqueProductIds.map(async (productId) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/inventory/${productId}`)
        newInventoryMap[productId] = res.data ? res.data.stockQuantity : 0
      } catch (err) {
        newInventoryMap[productId] = 0
      }
    }))
    setInventoryMap(newInventoryMap)
  }

  const handleUpdateQuantity = async (itemId, productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change
    const availableStock = inventoryMap[productId] || 0
    if (newQuantity < 1) return handleRemoveItem(itemId)
    if (newQuantity > availableStock) return alert(`You cannot add more. Only ${availableStock} left in stock!`)
    try {
        await axios.put(`http://localhost:8080/api/carts/item/${itemId}?quantity=${newQuantity}`)
        refreshCartData() 
    } catch (error) { alert("Could not update quantity.") }
  }

  const handleRemoveItem = async (itemId) => {
    try {
        await axios.delete(`http://localhost:8080/api/carts/item/${itemId}`)
        refreshCartData()
    } catch (error) { alert("Could not remove item.") }
  }

  return (
    <div style={{ marginTop: '40px', padding: '30px', backgroundColor: '#2a2a2a', borderRadius: '10px', border: '1px solid #555', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* 🟢 NEW: Cart specific Discount Box */}
      {globalDiscount?.isActive && (
        <div style={{ backgroundColor: '#422006', border: '1px dashed #d97706', color: '#f59e0b', padding: '15px', borderRadius: '8px', marginBottom: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>
            🏷️ {globalDiscount.discountMessage} — A {globalDiscount.discountPercentage}% OFF discount has been automatically applied to your total!
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>🛒 Your Shopping Cart</h2>
        <button onClick={refreshCartData} style={{ backgroundColor: '#444' }}>🔄 Refresh Cart</button>
      </div>

      {cartItems.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: '40px 0' }}>Your cart is currently empty.</p>
      ) : (
        <div>
          <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left' }}>
            {cartItems.map((item, index) => {
              const product = productDirectory[item.productId]
              const itemName = product ? product.name : `Loading Product...`
              const basePrice = product ? product.price : 0
              
              // 🟢 NEW: Calculate the exact discounted price for this row
              const finalPrice = globalDiscount?.isActive 
                ? basePrice - (basePrice * (globalDiscount.discountPercentage / 100))
                : basePrice

              const subtotal = finalPrice * item.quantity

              const availableStock = inventoryMap[item.productId]
              const isMaxedOut = availableStock !== undefined && item.quantity >= availableStock

              return (
                <li key={index} style={{ padding: '20px 10px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '18px' }}>{itemName}</strong>
                    
                    <div style={{ color: '#aaa', fontSize: '14px', marginTop: '5px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {globalDiscount?.isActive ? (
                          <>
                            <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>${finalPrice.toFixed(2)} each</span>
                            <span style={{ textDecoration: 'line-through', color: '#666', fontSize: '12px' }}>${basePrice.toFixed(2)}</span>
                          </>
                      ) : (
                          <span>${basePrice.toFixed(2)} each</span>
                      )}
                    </div>

                    {availableStock !== undefined && (
                        <div style={{ fontSize: '13px', color: isMaxedOut ? '#ff4d4d' : '#4CAF50', marginTop: '4px' }}>
                            {availableStock} available in stock
                        </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#333', borderRadius: '5px', padding: '5px' }}>
                        <button onClick={() => handleUpdateQuantity(item.id, item.productId, item.quantity, -1)} style={{ backgroundColor: 'transparent', color: 'white', border: 'none', padding: '5px 10px', fontSize: '18px', cursor: 'pointer' }}>➖</button>
                        <span style={{ padding: '0 15px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.productId, item.quantity, 1)} disabled={isMaxedOut} style={{ backgroundColor: 'transparent', color: isMaxedOut ? '#666' : 'white', border: 'none', padding: '5px 10px', fontSize: '18px', cursor: isMaxedOut ? 'not-allowed' : 'pointer' }}>➕</button>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: globalDiscount?.isActive ? '#4CAF50' : '#646cff', minWidth: '80px', textAlign: 'right' }}>
                      ${subtotal.toFixed(2)}
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} style={{ backgroundColor: '#ff4444', padding: '8px 12px', fontSize: '14px', marginLeft: '10px' }}>🗑️ Remove</button>
                  </div>
                </li>
              )
            })}
          </ul>
          
          <div style={{ textAlign: 'right', marginTop: '30px', fontSize: '24px' }}>
            Total: <strong style={{ color: '#4CAF50' }}>${grandTotal.toFixed(2)}</strong>
          </div>

          <button onClick={() => onNavigate('checkout')} style={{ width: '100%', padding: '15px', backgroundColor: '#4CAF50', color: 'white', fontSize: '18px', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer', border: 'none', borderRadius: '8px' }}>
            💳 Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}

export default Cart