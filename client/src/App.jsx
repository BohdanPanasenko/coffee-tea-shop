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
    <div style={{ margin: '0 auto', padding: '12px 16px' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          margin: 0,            // no extra top gap
          paddingTop: 0,        // no extra top gap
          marginBottom: 16,
        }}
      >
        {/* LEFT: brand */}
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 700, fontSize: 18 }}>
          ☕ Leaf & Bean
        </Link>

        {/* RIGHT: nav + search + cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Navigation (Coffee / Tea) */}
          <nav style={{ display: 'flex', gap: 14 }}>
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

          {/* Search + Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <form onSubmit={onSearch} style={{ display: 'flex', gap: 8 }}>
              <input name="q" placeholder="Search coffee / tea…" />
              <button type="submit">Search</button>
            </form>
            <Link to="/cart">🛒 Cart ({cartCount})</Link>
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
