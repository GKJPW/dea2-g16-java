import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import AdminDashboard from './components/AdminDashboard'
import Checkout from './components/Checkout' 
import Notifications from './components/Notifications' 
import ViewProduct from './components/ViewProduct'
import Auth from './components/Auth'
import OrderHistory from './components/OrderHistory'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('store') 
  const [selectedProductId, setSelectedProductId] = useState(null)
  
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null)
  const [currentUser, setCurrentUser] = useState(null)

  const [globalDiscount, setGlobalDiscount] = useState({ isActive: false, discountPercentage: 0, discountMessage: '' })

  useEffect(() => {
    if (authToken) {
      try {
        const payload = JSON.parse(atob(authToken.split('.')[1]))
        setCurrentUser({
          id: payload.id,
          name: payload.name,
          role: payload.role,
          email: payload.sub
        })
      } catch (e) {
        console.error("Invalid token format", e)
        handleLogout()
      }
    }
  }, [authToken])

  useEffect(() => {
    fetchGlobalDiscount()
  }, [currentView])

  const fetchGlobalDiscount = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/products/discount')
      if (res.data) setGlobalDiscount(res.data)
    } catch (e) {
      console.error("Failed to fetch discount", e)
    }
  }

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token) 
    setAuthToken(token)
    setCurrentView('store')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setAuthToken(null)
    setCurrentUser(null)
    setCurrentView('store')
  }

  const handleNavigate = (view, productId = null) => {
    setCurrentView(view)
    if (productId !== null) {
      setSelectedProductId(productId)
    }
  }

  if (!authToken) {
    return <Auth onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div style={{ maxWidth: '1400px', width: '95%', margin: '0 auto', paddingBottom: '50px' }}>
      
      {globalDiscount?.isActive && currentView !== 'admin' && (
        <div style={{ 
            backgroundColor: '#d97706', color: 'white', textAlign: 'center', padding: '12px', 
            borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold', fontSize: '18px', 
            border: '1px solid #b45309', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', letterSpacing: '1px'
        }}>
          🎉 {globalDiscount.discountMessage} — Enjoy {globalDiscount.discountPercentage}% OFF!
        </div>
      )}

      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        backgroundColor: '#1a1a1a', padding: '15px 30px', borderRadius: '10px', 
        marginBottom: '30px', border: '1px solid #333', flexWrap: 'wrap', gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 
            onClick={() => handleNavigate('store')} 
            style={{ margin: 0, color: '#646cff', fontSize: '24px', cursor: 'pointer' }}
          >
            🚀 OmniCart
          </h1>
          {currentUser && (
            <span style={{ color: '#aaa', fontSize: '14px', borderLeft: '1px solid #555', paddingLeft: '20px' }}>
              Welcome, <strong style={{color: 'white'}}>{currentUser.name}</strong> 
              {currentUser.role === 'ADMIN' && <span style={{ backgroundColor: '#e63946', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '10px', fontSize: '12px', fontWeight: 'bold' }}>ADMIN</span>}
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => handleNavigate('store')} style={{ backgroundColor: currentView === 'store' ? '#646cff' : '#333' }}>🏪 Storefront</button>
          
          {currentUser?.role === 'USER' && (
            <>
              <button onClick={() => handleNavigate('cart')} style={{ backgroundColor: currentView === 'cart' ? '#4CAF50' : '#333' }}>🛒 Cart</button>
              <button onClick={() => handleNavigate('orders')} style={{ backgroundColor: currentView === 'orders' ? '#1e3a8a' : '#333' }}>📦 Order History</button>
            </>
          )}
          
          <button onClick={() => handleNavigate('notifications')} style={{ backgroundColor: currentView === 'notifications' ? '#f59e0b' : '#333', color: 'white' }}>🔔 Notifications</button>

          {currentUser?.role === 'ADMIN' && (
            <button onClick={() => handleNavigate('admin')} style={{ backgroundColor: currentView === 'admin' ? '#e63946' : '#333' }}>⚙️ Administrator</button>
          )}

          <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: '#aaa' }}>🚪 Logout</button>
        </div>
      </nav>

      {currentView === 'store' && <ProductList onNavigate={handleNavigate} currentUser={currentUser} globalDiscount={globalDiscount} />}
      {currentView === 'cart' && <Cart onNavigate={handleNavigate} currentUser={currentUser} globalDiscount={globalDiscount} />}
      
      {/* 🟢 NEW: Pass globalDiscount into Checkout */}
      {currentView === 'checkout' && <Checkout onNavigate={handleNavigate} currentUser={currentUser} globalDiscount={globalDiscount} />}
      
      {currentView === 'notifications' && <Notifications currentUser={currentUser} />}
      {currentView === 'viewProduct' && <ViewProduct productId={selectedProductId} onNavigate={handleNavigate} currentUser={currentUser} globalDiscount={globalDiscount} />}
      {currentView === 'orders' && currentUser?.role === 'USER' && <OrderHistory currentUser={currentUser} onNavigate={handleNavigate} globalDiscount={globalDiscount} />}
      {currentView === 'admin' && currentUser?.role === 'ADMIN' && <AdminDashboard />}

    </div>
  )
}

export default App