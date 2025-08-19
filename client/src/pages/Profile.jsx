import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import '../styles/pages/profile.css'

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

    if (!isLoggedIn) {
        return (
            <div className="profile-guest">
                <div className="profile-guest-card">
                    <div className="profile-guest-avatar">🔒</div>
                    <h2 className="profile-guest-title">You are not logged in</h2>
                    <p className="profile-guest-text">
                        Please log in to access your profile and manage your account information.
                    </p>
                    <Link to="/auth" className="profile-guest-login">
                        🔑 Go to Login Page
                    </Link>
                    <div className="profile-guest-continue">
                        <Link to="/">← Continue shopping</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-header-row">
                    <div className="profile-avatar">👤</div>
                </div>
                <h2 className="profile-header-title">My Profile</h2>
                <p className="profile-header-subtitle">Manage your account information</p>
            </div>

            <div className="profile-card">
                <div className="profile-card-header">
                    <h3>Personal Information</h3>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="edit-btn">
                            Edit Profile
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSave}>
                        <div className="profile-form-grid">
                            <div>
                                <label className="profile-label">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="profile-input"
                                />
                            </div>

                            <div>
                                <label className="profile-label">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="profile-input"
                                />
                            </div>

                            <div>
                                <label className="profile-label">Phone</label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="profile-input"
                                />
                            </div>

                            <div>
                                <label className="profile-label">Address</label>
                                <textarea
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    rows={3}
                                    className="profile-textarea"
                                />
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button type="submit" className="btn-save">Save Changes</button>
                            <button type="button" onClick={handleCancel} className="btn-cancel">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-info-grid">
                        <div>
                            <strong className="profile-info-label">Full Name:</strong>
                            <div className="profile-info-value">{userInfo.name}</div>
                        </div>
                        <div>
                            <strong className="profile-info-label">Email:</strong>
                            <div className="profile-info-value">{userInfo.email}</div>
                        </div>
                        <div>
                            <strong className="profile-info-label">Phone:</strong>
                            <div className="profile-info-value">{userInfo.phone}</div>
                        </div>
                        <div>
                            <strong className="profile-info-label">Address:</strong>
                            <div className="profile-info-value">{userInfo.address}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-orders">
                <h3>Order History</h3>
                <div className="profile-orders-empty">
                    <p>No orders yet</p>
                    <p className="hint">Start shopping to see your order history here!</p>
                </div>
            </div>
        </div>
    )
}
