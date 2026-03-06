import { useState } from 'react'
import axios from 'axios'

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        // 🟢 Execute Login
        const res = await axios.post('http://localhost:8080/api/users/login', {
          email: formData.email,
          password: formData.password
        })
        const token = res.data.token
        onLoginSuccess(token) // Pass token to App.jsx
      } else {
        // 🟢 Execute Registration
        await axios.post('http://localhost:8080/api/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'USER' // New accounts are strictly normal users by default!
        })
        alert("✅ Account created successfully! Please log in.")
        setIsLogin(true) // Switch back to login view
      }
    } catch (err) {
      console.error(err)
      setError(isLogin ? "Invalid email or password." : "Failed to create account. Email might be in use.")
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid #444', textAlign: 'center' }}>
      <h1 style={{ color: '#646cff', marginBottom: '10px' }}>🚀 OmniCart</h1>
      <h2 style={{ marginBottom: '20px', color: 'white' }}>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
      
      {error && <div style={{ backgroundColor: '#dc2626', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
        )}
        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
        
        <button type="submit" style={{ padding: '15px', backgroundColor: '#646cff', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
          {isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '20px', color: '#aaa' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#4CAF50', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
          {isLogin ? "Sign Up" : "Log In"}
        </span>
      </p>
    </div>
  )
}

export default Auth