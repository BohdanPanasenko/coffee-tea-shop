const KEY = 'cart_v1';
const emitter = new EventTarget();

function load()
{
    try { return JSON.parse(localStorage.getItem(KEY)) || { items: [] }; }
    catch { return { items: [] }; }
}
function save(cart)
{
    localStorage.setItem(KEY, JSON.stringify(cart));
    emitter.dispatchEvent(new Event('change'));
}

export function getCart()
{
    return load();
}

export function clearCart()
{
    save({ items: [] });
}

export function getCount()
{
    return load().items.reduce((a, b) => a + b.qty, 0);
}

export function getSubtotalCents()
{
    return load().items.reduce((a, b) => a + b.priceCents * b.qty, 0);
}
export function onCartChange(fn)
{
    const handler = () => fn(getCount());
    emitter.addEventListener('change', handler);
    return () => emitter.removeEventListener('change', handler);
}
export function addToCart(product, qty = 1)
{
    const cart = load();
    const i = cart.items.findIndex(x => x.productId === product.id);
    if (i >= 0) cart.items[i].qty += qty;
    else cart.items.push({
        productId: product.id,
        title: product.title,
        priceCents: product.priceCents,
        imageUrl: product.imageUrl,
        qty,
    });
    save(cart);
}
export function setQty(productId, qty) {
    const cart = load();
    const item = cart.items.find(x => x.productId === productId);
    if (item) { item.qty = Math.max(1, Number(qty) || 1); save(cart); }
}
export function removeFromCart(productId) {
    const cart = load();
    cart.items = cart.items.filter(x => x.productId !== productId);
    save(cart);
}
