import { useState } from 'react'
import axios from 'axios'

const Checkout = ({ onNavigate, currentUser, globalDiscount }) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async (e) => {
    e.preventDefault() 
    setIsProcessing(true) 

    try {
      const cartRes = await axios.get(`http://localhost:8080/api/carts/${currentUser.id}`)
      const purchasedItems = cartRes.data

      const prodRes = await axios.get('http://localhost:8080/api/products')
      const products = prodRes.data
      
      const prodMap = {}
      const finalPricesMap = {} 

      products.forEach(p => {
          prodMap[p.id] = p.name
          const basePrice = p.price
          const finalPrice = globalDiscount?.isActive 
              ? basePrice - (basePrice * (globalDiscount.discountPercentage / 100))
              : basePrice
          
          finalPricesMap[String(p.id)] = finalPrice
      })

      // 🟢 NEW: Figure out what percentage to tell the backend to freeze
      const discountToApply = globalDiscount?.isActive ? globalDiscount.discountPercentage : 0;

      await new Promise(resolve => setTimeout(resolve, 2000))

      // 🟢 NEW: Append the discount to the URL query string!
      await axios.post(`http://localhost:8080/api/orders/checkout/${currentUser.id}?discount=${discountToApply}`, finalPricesMap)
      
      for (const item of purchasedItems) {
        const pName = prodMap[item.productId] || `Product ID ${item.productId}`

        await axios.post('http://localhost:8080/api/notifications', {
            type: 'PURCHASED',
            message: `You successfully purchased ${item.quantity}x ${pName}.`,
            recipient: currentUser.id.toString() 
        })

        await axios.post('http://localhost:8080/api/notifications', {
            type: 'SOLD',
            message: `[ID: ${item.productId}] ${pName} - ${item.quantity} units were sold!`,
            recipient: 'ADMIN'
        })

        try {
            const invRes = await axios.get(`http://localhost:8080/api/inventory/${item.productId}`)
            const newStock = invRes.data ? invRes.data.stockQuantity : 0

            if (newStock === 0) {
                await axios.post('http://localhost:8080/api/notifications', {
                    type: 'OUT_OF_STOCK',
                    message: `[ID: ${item.productId}] ${pName} stock is OVER. Immediate Restock Required!`,
                    recipient: 'ADMIN'
                })
            } else if (newStock <= 5) {
                await axios.post('http://localhost:8080/api/notifications', {
                    type: 'LOW_STOCK',
                    message: `[ID: ${item.productId}] ${pName} stock is getting Low! Only ${newStock} left.`,
                    recipient: 'ADMIN'
                })
            }
        } catch (err) {
            await axios.post('http://localhost:8080/api/notifications', {
                type: 'OUT_OF_STOCK',
                message: `[ID: ${item.productId}] ${pName} stock is OVER. Immediate Restock Required!`,
                recipient: 'ADMIN'
            })
        }
      }

      alert("🎉 Payment Successful! Your order has been placed, inventory deducted, and notification sent!")
      
      onNavigate('store')

    } catch (error) {
      console.error("Checkout failed:", error)
      alert("❌ Payment Failed. Check the backend logs!")
      setIsProcessing(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', backgroundColor: '#2a2a2a', borderRadius: '10px', border: '1px solid #444', textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>🔒 Secure Checkout</h2>
      <p style={{ textAlign: 'center', color: '#aaa', marginBottom: '30px' }}>Please enter your payment details below.</p>
      
      <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>Name on Card</label>
          <input type="text" defaultValue={currentUser?.name || ''} placeholder="Janith ..." required style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>Card Number</label>
          <input type="text" placeholder="1234 5678 9101 1121" required maxLength="16" style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>Expiry (MM/YY)</label>
            <input type="text" placeholder="12/26" required maxLength="5" style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#ccc' }}>CVV</label>
            <input type="password" placeholder="***" required maxLength="3" style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing}
          style={{ 
              marginTop: '10px', 
              padding: '15px', 
              backgroundColor: isProcessing ? '#555' : '#4CAF50', 
              color: 'white', 
              fontSize: '18px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
          }}>
          {isProcessing ? "🔄 Processing Payment..." : "💳 Pay Now"}
        </button>
      </form>
    </div>
  )
}

export default Checkout