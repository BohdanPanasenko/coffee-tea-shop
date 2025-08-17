import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCategories } from './api'
import { getCount, onCartChange } from './cart'
import { useAuth } from './hooks/useAuth.jsx'

export default function App()
{
  const { isLoggedIn, user, logout } = useAuth()
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useSearchParams()
  const [cartCount, setCartCount] = useState(getCount())
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories().then(setCats).finally(() => setLoading(false))
    return onCartChange(setCartCount)
  }, [])

  const onSearch = (e) => {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q')?.trim()
    const next = new URLSearchParams(params)
    if (q) next.set('query', q); else next.delete('query')
    navigate('/?' + next.toString())
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{ margin: '0 auto', padding: '12px 16px' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          margin: 0,
          paddingTop: 0,
          marginBottom: 16,
        }}
      >
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>
          ☕ Leaf & Bean
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <nav style={{ display: 'flex', gap: 14 }}>
            <Link to="/">All Products</Link>
            {loading ? (
              <span>Loading…</span>
            ) : (
              cats.map((c) => (
                <Link key={c.slug} to={{ pathname: '/', search: `?category=${c.slug}` }}>
                  {c.name}
                </Link>
              ))
            )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <form onSubmit={onSearch} style={{ display: 'flex', gap: 8 }}>
              <input name="q" placeholder="Search coffee / tea…" />
              <button type="submit">Search</button>
            </form>
            <Link to="/cart">🛒 Cart ({cartCount})</Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/profile"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    textDecoration: 'none',
                    padding: '6px 8px',
                    borderRadius: 4,
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #dee2e6',
                    color: '#495057',
                    fontSize: 12
                  }}
                  title={user?.name || 'My Profile'}
                >
                  👤
                  <span style={{ marginLeft: 4, fontSize: 11 }}>
                    {user?.name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '6px 8px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: 4,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                  title="Logout"
                >
                  🚪
                </button>
              </>
            ) : (
              <Link 
                to="/auth"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                  padding: '6px 8px',
                  borderRadius: 4,
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  color: '#495057',
                  fontSize: 12
                }}
                title="Sign In"
              >
                🔑 Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      <footer style={{ marginTop: 24, opacity: 0.7 }}>
        <small>© {new Date().getFullYear()} Leaf & Bean</small>
      </footer>
    </div>
  );
}
