import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, clearCart } from '../cart'
import '../styles/pages/checkout.css'

export default function Checkout()
{
    const [contact, setContact] = useState({ name: '', email: '', address: '' })
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState(null)
    const navigate = useNavigate()
    const cart = getCart()

    const onSubmit = async (e) =>
    {
        e.preventDefault()
        if (!cart.items.length) return alert('Your cart is empty.')
        setSubmitting(true)
        try
        {
            const res = await fetch('http://localhost:4000/api/orders',
                {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contact,
                    items: cart.items.map(i => ({ productId: i.productId, qty: i.qty })),
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Order failed')
            setResult(data)
            clearCart()
        }
        catch (err)
        {
            alert(err.message)
        }
        finally
        {
            setSubmitting(false)
        }
    }

    if (result)
    {
        return (
            <div>
                <h2>Order placed ✔</h2>
                <p>Order ID: <strong>{result.id}</strong></p>
                <p>Total: <strong>${(result.totalCents / 100).toFixed(2)}</strong></p>
                <button onClick={() => navigate('/')}>Back to shop</button>
            </div>
        )
    }

    return (
        <div>
            <h2>Checkout</h2>
            <form onSubmit={onSubmit} className="checkout-form">
                <input placeholder="Full name" value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} required />
                <input placeholder="Email" type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} required />
                <textarea placeholder="Address" value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} rows={4} required />
                <button disabled={submitting}>{submitting ? 'Placing order…' : 'Place order'}</button>
            </form>
        </div>
    )
}
