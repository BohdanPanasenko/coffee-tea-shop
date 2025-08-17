import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function Profile() {
    const { user, isLoggedIn, logout } = useAuth()
    const navigate = useNavigate()
    
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    })

    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({ ...userInfo })

    useEffect(() => {
        // Load user data if logged in (no redirect)
        if (user && isLoggedIn) {
            const initialData = {
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            }
            setUserInfo(initialData)
            setEditForm(initialData)
        }
    }, [isLoggedIn, user])

    const handleSave = (e) => {
        e.preventDefault()
        setUserInfo({ ...editForm })
        setIsEditing(false)
        
        // Update user data in localStorage
        const updatedUser = { ...user, ...editForm }
        localStorage.setItem('user', JSON.stringify(updatedUser))
    }

    const handleCancel = () => {
        setEditForm({ ...userInfo })
        setIsEditing(false)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
                <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '2px solid #dee2e6',
                    borderRadius: 12,
                    padding: 40
                }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        backgroundColor: '#6c757d',
                        borderRadius: '50%',
                        margin: '0 auto 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        color: 'white'
                    }}>
                        🔒
                    </div>
                    <h2 style={{ margin: '0 0 16px 0', fontSize: 24, color: '#495057' }}>
                        You are not logged in
                    </h2>
                    <p style={{ margin: '0 0 24px 0', color: '#6c757d', fontSize: 16 }}>
                        Please log in to access your profile and manage your account information.
                    </p>
                    <Link 
                        to="/auth"
                        style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#385169ff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: 6,
                            fontSize: 16,
                            fontWeight: 500
                        }}
                    >
                        🔑 Go to Login Page
                    </Link>
                    <div style={{ marginTop: 20 }}>
                        <Link 
                            to="/"
                            style={{
                                color: '#6c757d',
                                textDecoration: 'none',
                                fontSize: 14
                            }}
                        >
                            ← Continue shopping
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 0' }}>
            <div style={{
                backgroundColor: '#385169ff',
                padding: 24,
                borderRadius: 8,
                marginBottom: 24,
                textAlign: 'center',
                position: 'relative'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 20,
                    marginBottom: 16
                }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        backgroundColor: '#6c757d',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        color: 'white'
                    }}>
                        👤
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: '#385169ff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'white'
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)'
                        }}
                    >
                        � Logout
                    </button>
                </div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: 24, color: 'white' }}>My Profile</h2>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Manage your account information</p>
            </div>

            <div style={{
                backgroundColor: '#385169ff',
                border: '1px solid #dee2e6',
                borderRadius: 8,
                padding: 24
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}>
                    <h3 style={{ margin: 0 }}>Personal Information</h3>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#575d63ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer'
                            }}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #ced4da',
                                        borderRadius: 4,
                                        fontSize: 14
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #ced4da',
                                        borderRadius: 4,
                                        fontSize: 14
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #ced4da',
                                        borderRadius: 4,
                                        fontSize: 14
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                                    Address
                                </label>
                                <textarea
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #ced4da',
                                        borderRadius: 4,
                                        fontSize: 14,
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer'
                                }}
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ display: 'grid', gap: 16 }}>
                        <div>
                            <strong style={{ color: '#b8c8d8ff' }}>Full Name:</strong>
                            <div style={{ marginTop: 4 }}>{userInfo.name}</div>
                        </div>
                        <div>
                                <strong style={{ color: '#b8c8d8ff' }}>Email:</strong>
                            <div style={{ marginTop: 4 }}>{userInfo.email}</div>
                        </div>
                        <div>
                                <strong style={{ color: '#b8c8d8ff' }}>Phone:</strong>
                            <div style={{ marginTop: 4 }}>{userInfo.phone}</div>
                        </div>
                        <div>
                                <strong style={{ color: '#b8c8d8ff' }}>Address:</strong>
                            <div style={{ marginTop: 4 }}>{userInfo.address}</div>
                        </div>
                    </div>
                )}
            </div>

            <div style={{
                backgroundColor: '#385169ff',
                border: '1px solid #dee2e6',
                borderRadius: 8,
                padding: 24,
                marginTop: 24
            }}>
                <h3 style={{ margin: '0 0 16px 0' }}>Order History</h3>
                <div style={{ color: '#6c757d', textAlign: 'center', padding: 40 }}>
                    <p>No orders yet</p>
                    <p style={{ fontSize: 14 }}>Start shopping to see your order history here!</p>
                </div>
            </div>
        </div>
    )
}
