require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'], credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.get('/api/categories', async (_req, res) => {
    try {
        const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
        res.json(cats);
    } catch (e) {
        console.error('GET /api/categories error:', e);
        res.status(500).json({ error: 'Failed to load categories' });
    }
});

app.get('/api/products', async (req, res) => {
    const { category, query, page = 1 } = req.query;
    const take = 12, skip = (Number(page) - 1) * take;
    const where = {
        isActive: true,
        ...(query ? {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ]
        } : {}),
        ...(category ? { category: { slug: category } } : {}),
    };
    try {
        const [items, total] = await Promise.all([
            prisma.product.findMany({ where, include: { category: true }, orderBy: { title: 'asc' }, skip, take }),
            prisma.product.count({ where }),
        ]);
        res.json({ items, total, page: Number(page), pageSize: take });
    } catch { res.status(500).json({ error: 'Failed to load products' }); }
});

app.get('/api/products/:slug', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({ where: { slug: req.params.slug }, include: { category: true } });
        if (!product) return res.status(404).json({ error: 'Not found' });
        res.json(product);
    } catch { res.status(500).json({ error: 'Failed to load product' }); }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));


app.post('/api/orders', async (req, res) => {
    try {
        const { items = [], contact = {} } = req.body || {};
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'No items provided' });
        }
        const clean = items
            .map(i => ({
                productId: Number(i.productId),
                quantity: Math.max(1, Number(i.qty ?? i.quantity ?? 1)),
            }))
            .filter(i => Number.isInteger(i.productId) && i.productId > 0);

        if (!clean.length) return res.status(400).json({ error: 'Invalid items' });

        const ids = [...new Set(clean.map(i => i.productId))];
        const products = await prisma.product.findMany({
            where: { id: { in: ids }, isActive: true },
        });
        if (products.length !== ids.length) {
            return res.status(400).json({ error: 'Some products not found or inactive' });
        }

        let totalCents = 0;
        const orderItemsData = clean.map(i => {
            const p = products.find(x => x.id === i.productId);
            const priceCents = p.priceCents;
            totalCents += priceCents * i.quantity;
            return { productId: p.id, quantity: i.quantity, priceCents };
        });

        const order = await prisma.order.create({
            data: {
                status: 'PENDING',
                totalCents,
                userId: null, 
                items: { create: orderItemsData },
            },
            include: { items: { include: { product: true } } },
        });

        res.json({
            id: order.id,
            totalCents: order.totalCents,
            items: order.items.map(i => ({
                id: i.id,
                productId: i.productId,
                title: i.product.title,
                qty: i.quantity,
                priceCents: i.priceCents,
            })),
            contact, 
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create order' });
    }
});