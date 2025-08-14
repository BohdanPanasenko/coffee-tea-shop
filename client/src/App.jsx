import { Outlet, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCategories } from './api'
import { getCount, onCartChange } from './cart'

export default function App() {
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

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>☕ Leaf & Bean</Link>

        <nav style={{ display: 'flex', gap: 12 }}>
          {loading ? <span>Loading…</span> : cats.map(c =>
            <Link
              key={c.slug}
              to={{ pathname: '/', search: `?category=${c.slug}` }}
            >
              {c.name}
            </Link>
          )}
        </nav>

        <form onSubmit={onSearch} style={{ marginLeft: 'auto' }}>
          <input name="q" placeholder="Search coffee / tea…" />
          <button type="submit" style={{ marginLeft: 8 }}>Search</button>
        </form>

        <Link to="/cart" style={{ marginLeft: 12 }}>🛒 Cart ({cartCount})</Link>
      </header>

      <Outlet />
      <footer style={{ marginTop: 24, opacity: 0.7 }}>
        <small>© {new Date().getFullYear()} Leaf & Bean</small>
      </footer>
    </div>
  )
}
