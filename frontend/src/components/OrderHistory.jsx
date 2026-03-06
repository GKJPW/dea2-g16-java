import { useState, useEffect } from 'react'
import axios from 'axios'

const OrderHistory = ({ currentUser, onNavigate, globalDiscount }) => {
  const [orders, setOrders] = useState([])
  const [productDirectory, setProductDirectory] = useState({})
  
  const cardColors = ['#1e3a8a', '#064e3b', '#422006', '#2e1065', '#3f1d1d']

  useEffect(() => {
    fetchHistoryData()
  }, [currentUser])

  const fetchHistoryData = async () => {
    try {
      const orderRes = await axios.get(`http://localhost:8080/api/orders/history/${currentUser.id}`)
      setOrders(orderRes.data)

      const prodRes = await axios.get('http://localhost:8080/api/products')
      const directory = {}
      prodRes.data.forEach(p => {
        directory[p.id] = p
      })
      setProductDirectory(directory)

    } catch (error) {
      console.error("Failed to fetch order history:", error)
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Time Pending' 
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

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>📦 My Order History</h2>
        <span style={{ color: '#aaa', fontSize: '14px' }}>Showing latest {orders.length} orders</span>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#2a2a2a', borderRadius: '10px' }}>
            <p style={{ color: '#aaa', fontSize: '18px' }}>You haven't placed any orders yet.</p>
            <button onClick={() => onNavigate('store')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Start Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order, index) => {
            const product = productDirectory[order.productId]
            const pName = product ? product.name : `Unknown Product (ID: ${order.productId})`
            
            const pTotal = order.totalAmount || 0
            
            // 🟢 NEW: Check if this specific order had a discount frozen into it
            const isDiscounted = order.appliedDiscount && order.appliedDiscount > 0

            return (
              <div key={order.id} style={{ 
                  backgroundColor: '#2a2a2a', 
                  borderLeft: `8px solid ${cardColors[index % cardColors.length]}`, 
                  borderRadius: '8px', 
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
              }}>
                <div style={{ flex: 2, minWidth: '250px' }}>
                  <div style={{ color: '#ccc', fontSize: '12px', marginBottom: '8px', letterSpacing: '1px' }}>
                    ORDER #{order.orderNumber.split('-')[0].toUpperCase()} • {formatDateTime(order.orderDate)}
                  </div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: 'white' }}>{pName}</h3>
                  <div style={{ color: '#aaa', fontSize: '14px' }}>
                    Product ID: {order.productId}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: '100px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#aaa' }}>Quantity</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{order.quantity}</div>
                </div>

                {/* 🟢 NEW: Conditional UI for the Total Paid Column */}
                <div style={{ flex: 1, minWidth: '100px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: '#aaa' }}>Total Paid</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: isDiscounted ? '#f59e0b' : '#4CAF50' }}>
                            ${pTotal.toFixed(2)}
                        </div>
                        {isDiscounted && (
                            <span style={{ fontSize: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #f59e0b', fontWeight: 'bold' }}>
                                🏷️ {order.appliedDiscount}% OFF
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '120px', textAlign: 'right' }}>
                  <button 
                    onClick={() => onNavigate('viewProduct', order.productId)}
                    style={{ 
                        padding: '10px 15px', 
                        backgroundColor: 'transparent', 
                        border: '1px solid #555', 
                        color: 'white', 
                        borderRadius: '5px', 
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#444'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    🔍 View Product
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderHistory