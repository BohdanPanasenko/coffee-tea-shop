import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCart, setQty, removeFromCart, getSubtotalCents } from '../cart'

export default function Cart() {
    const [cart, setCart] = useState(getCart())
    const navigate = useNavigate()

    useEffect(() => {
        const onStorage = () => setCart(getCart())
        window.addEventListener('storage', onStorage)
        return () => window.removeEventListener('storage', onStorage)
    }, [])

    const onChangeQty = (id, v) => {
        setQty(id, Number(v))
        setCart(getCart())
    }
    const onRemove = (id) => {
        removeFromCart(id)
        setCart(getCart())
    }

    if (!cart.items.length) {
        return (
            <div>
                <h2>Your cart is empty</h2>
                <Link to="/">← Back to shop</Link>
            </div>
        )
    }

    return (
        <div>
            <h2>Your Cart</h2>
            <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                {cart.items.map(it => (
                    <div key={it.productId} style={{ display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #ddd', borderRadius: 8, padding: 8 }}>
                        <img src={it.imageUrl} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>{it.title}</div>
                            <div>${(it.priceCents / 100).toFixed(2)}</div>
                        </div>
                        <input type="number" min="1" value={it.qty} onChange={e => onChangeQty(it.productId, e.target.value)} style={{ width: 70 }} />
                        <button onClick={() => onRemove(it.productId)}>Remove</button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Subtotal: ${(getSubtotalCents() / 100).toFixed(2)}</strong>
                <button onClick={() => navigate('/checkout')}>Checkout →</button>
            </div>
        </div>
    )
}
