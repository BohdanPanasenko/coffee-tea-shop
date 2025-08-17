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
        const product = await prisma.product.findUnique({ 
            where: { slug: req.params.slug }, 
            include: { 
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: { name: true, avatar: true } // Don't expose sensitive user data
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            } 
        });
        if (!product) return res.status(404).json({ error: 'Not found' });
        
        // Calculate average rating
        const avgRating = product.reviews.length > 0 
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            : 0;
        
        res.json({ ...product, avgRating, reviewCount: product.reviews.length });
    } catch { res.status(500).json({ error: 'Failed to load product' }); }
});

// Review endpoints
app.get('/api/products/:slug/reviews', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        
        const reviews = await prisma.review.findMany({
            where: { productId: product.id },
            include: {
                user: {
                    select: { name: true, avatar: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        res.json(reviews);
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Failed to load reviews' });
    }
});

app.post('/api/products/:slug/reviews', async (req, res) => {
    try {
        const { rating, comment, userEmail } = req.body;
        
        if (!userEmail) {
            return res.status(401).json({ error: 'User must be logged in to review' });
        }
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        if (!comment || comment.trim().length < 10) {
            return res.status(400).json({ error: 'Comment must be at least 10 characters' });
        }
        
        // Find the product
        const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        
        // Find or create user (for now, we'll create a simple user if doesn't exist)
        let user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (!user) {
            const name = userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            user = await prisma.user.create({
                data: {
                    email: userEmail,
                    name,
                    passwordHash: 'temp', // We'll use a temp password since this is localStorage auth
                }
            });
        }
        
        // Create or update review
        const review = await prisma.review.upsert({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: product.id
                }
            },
            update: {
                rating,
                comment: comment.trim()
            },
            create: {
                rating,
                comment: comment.trim(),
                userId: user.id,
                productId: product.id
            },
            include: {
                user: {
                    select: { name: true, avatar: true }
                }
            }
        });
        
        res.status(201).json(review);
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
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