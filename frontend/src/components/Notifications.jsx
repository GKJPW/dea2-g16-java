import { useState, useEffect } from 'react'
import axios from 'axios'

// 🟢 NEW: Accept currentUser prop
const Notifications = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([])
  const [filterType, setFilterType] = useState('ALL')

  // 🟢 NEW: Dynamic Recipient Channel based on Role
  const recipientChannel = currentUser.role === 'ADMIN' ? 'ADMIN' : currentUser.id.toString()

  useEffect(() => {
    fetchNotifications()
    setFilterType('ALL')
  }, [recipientChannel]) 

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/notifications/${recipientChannel}`)
      setNotifications(res.data)
    } catch (err) {
      console.error("Failed to fetch notifications", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${id}`)
      fetchNotifications()
    } catch (err) {
      console.error("Failed to delete", err)
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm(`Clear all notifications?`)) return
    try {
      await axios.delete(`http://localhost:8080/api/notifications/clear/${recipientChannel}`)
      fetchNotifications()
    } catch (err) {
      console.error("Failed to clear", err)
    }
  }

  const getColorStyle = (type) => {
    switch (type) {
      case 'ADDED': return { bg: '#1e3a8a', border: '#3b82f6', text: '🔵' } 
      case 'DELETED': return { bg: '#3f1d1d', border: '#ef4444', text: '🗑️' } 
      case 'LOW_STOCK': return { bg: '#422006', border: '#f97316', text: '⚠️' } 
      case 'OUT_OF_STOCK': return { bg: '#450a0a', border: '#dc2626', text: '🚨' } 
      case 'SOLD': return { bg: '#2e1065', border: '#8b5cf6', text: '💸' } 
      case 'PURCHASED': return { bg: '#064e3b', border: '#22c55e', text: '✅' } 
      default: return { bg: '#2a2a2a', border: '#555', text: '🔔' }
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Legacy Alert';
    
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

  const filteredNotifs = filterType === 'ALL' 
    ? notifications 
    : notifications.filter(n => n.type === filterType)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        
        {/* 🟢 NEW: Clean Header, completely removed the toggle buttons! */}
        <h2>{currentUser.role === 'ADMIN' ? '🛠️ Admin Alerts' : '🔔 Personal Notifications'}</h2>
        
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#333', color: 'white', border: '1px solid #555' }}>
          <option value="ALL">All Types</option>
          
          {currentUser.role === 'ADMIN' ? (
            <>
              <option value="ADDED">Product Added / Restocked</option>
              <option value="DELETED">Product Deleted</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="SOLD">Product Sold</option>
            </>
          ) : (
            <>
              <option value="PURCHASED">My Purchases</option>
              <option value="ADDED">My Reviews</option>
            </>
          )}
          
        </select>
        
        <button onClick={handleClearAll} style={{ padding: '10px 15px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Clear All
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {filteredNotifs.length === 0 ? <p style={{ color: '#aaa', textAlign: 'center', padding: '40px 0' }}>No notifications found.</p> : null}
        
        {filteredNotifs.map(n => {
          const colors = getColorStyle(n.type)
          return (
            <div key={n.id} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: colors.bg, borderLeft: `5px solid ${colors.border}`, 
              padding: '15px', borderRadius: '5px', color: 'white'
            }}>
              <div>
                <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '5px', fontWeight: 'bold' }}>
                  {formatDateTime(n.timestamp)}
                </div>
                <div style={{ fontSize: '16px' }}>{colors.text} {n.message}</div>
              </div>
              <button onClick={() => handleDelete(n.id)} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '18px' }}>✖</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Notifications