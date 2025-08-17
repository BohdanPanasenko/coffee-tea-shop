import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Auth() {
    const { isLoggedIn, user, login } = useAuth()
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    })

    if (isLoggedIn) {
        return (
            <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 20px' }}>
                <div style={{
                    backgroundColor: '#d4edda',
                    border: '2px solid #c3e6cb',
                    borderRadius: 8,
                    padding: 32,
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#28a745',
                        borderRadius: '50%',
                        margin: '0 auto 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        color: 'white'
                    }}>
                        ✅
                    </div>

                    <h2 style={{ margin: '0 0 8px 0', fontSize: 24, color: '#155724' }}>
                        You are already logged in!
                    </h2>

                    <p style={{ margin: '0 0 24px 0', color: '#155724', fontSize: 14 }}>
                        Welcome back, <strong>{user?.name}</strong>!
                    </p>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link
                            to="/profile"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#385169ff',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500
                            }}
                        >
                            👤 Go to Profile
                        </Link>

                        <Link
                            to="/"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: 4,
                                fontSize: 14,
                                fontWeight: 500
                            }}
                        >
                            🏠 Go to Shop
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (isLogin) {
            // Login logic
            console.log('Login attempt:', { email: formData.email, password: formData.password })
            // For login, we'll use the email as the name temporarily, or extract from email
            const nameFromEmail = formData.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            const userData = {
                name: nameFromEmail,
                email: formData.email,
                phone: '',
                address: ''
            }
            login(userData)
            // Navigate to profile after successful login
            navigate('/profile')
        } else {
            // Register logic
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!')
                return
            }
            console.log('Register attempt:', formData)
            // Use the actual name from the form
            const userData = {
                name: formData.name,
                email: formData.email,
                phone: '',
                address: ''
            }
            login(userData)
            // Navigate to profile after successful registration
            navigate('/profile')
        }
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: '0 20px' }}>
            <div style={{
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: 8,
                padding: 32,
                textAlign: 'center'
            }}>
                <div style={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#385169ff',
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: 'white'
                }}>
                    {isLogin ? '🔑' : '👤'}
                </div>

                <h2 style={{ margin: '0 0 8px 0', fontSize: 24, color: '#333' }}>
                    {isLogin ? 'Welcome Back!' : 'Create Account'}
                </h2>

                <p style={{ margin: '0 0 24px 0', color: '#6c757d', fontSize: 14 }}>
                    {isLogin
                        ? 'Please sign in to access your profile and order history'
                        : 'Join us to start your coffee & tea journey!'}
                </p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    {!isLogin && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required={!isLogin}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #ced4da',
                                    borderRadius: 4,
                                    fontSize: 14,
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Enter your full name"
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: 4,
                                fontSize: 14,
                                boxSizing: 'border-box'
                            }}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: '1px solid #ced4da',
                                borderRadius: 4,
                                fontSize: 14,
                                boxSizing: 'border-box'
                            }}
                            placeholder="Enter your password"
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500, fontSize: 14 }}>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required={!isLogin}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #ced4da',
                                    borderRadius: 4,
                                    fontSize: 14,
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Confirm your password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#385169ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            fontSize: 16,
                            fontWeight: 500,
                            cursor: 'pointer',
                            marginBottom: 16
                        }}
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', fontSize: 14 }}>
                    <span style={{ color: '#6c757d' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#385169ff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: 14
                        }}
                    >
                        {isLogin ? 'Sign up here' : 'Sign in here'}
                    </button>
                </div>

                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <Link
                        to="/"
                        style={{
                            color: '#6c757d',
                            textDecoration: 'none',
                            fontSize: 14
                        }}
                    >
                        ← Continue shopping without account
                    </Link>
                </div>
            </div>
        </div>
    )
}
