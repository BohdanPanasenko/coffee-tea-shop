import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCart, setQty, removeFromCart, getSubtotalCents } from '../cart'
import '../styles/pages/cart.css'

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
            <div className="cart-list">
                {cart.items.map(it => (
                    <div key={it.productId} className="cart-item">
                        <img src={it.imageUrl} alt={it.title} className="cart-item-image" />
                        <div className="cart-item-info">
                            <div className="cart-item-title">{it.title}</div>
                            <div>${(it.priceCents / 100).toFixed(2)}</div>
                        </div>
                        <input
                            type="number"
                            min="1"
                            value={it.qty}
                            onChange={e => onChangeQty(it.productId, e.target.value)}
                            className="qty-input"
                            aria-label={`Quantity for ${it.title}`}
                        />
                        <button onClick={() => onRemove(it.productId)}>Remove</button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <strong>Subtotal: ${(getSubtotalCents() / 100).toFixed(2)}</strong>
                <button onClick={() => navigate('/checkout')}>Checkout →</button>
            </div>
        </div>
    )
}
