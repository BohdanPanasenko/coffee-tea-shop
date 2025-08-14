require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.get('/api/categories', async (_req, res) => {
    try { res.json(await prisma.category.findMany({ orderBy: { name: 'asc' } })); }
    catch { res.status(500).json({ error: 'Failed to load categories' }); }
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
