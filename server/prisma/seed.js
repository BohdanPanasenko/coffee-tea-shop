const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const coffee = await prisma.category.upsert({
        where: { slug: 'coffee' }, update: {}, create: { name: 'Coffee', slug: 'coffee' },
    });
    const tea = await prisma.category.upsert({
        where: { slug: 'tea' }, update: {}, create: { name: 'Tea', slug: 'tea' },
    });

    const products = [
        {
            title: 'Ethiopian Yirgacheffe', slug: 'ethiopian-yirgacheffe',
            description: 'Floral aroma, citrus, bright acidity. 250g whole beans.',
            priceCents: 1499, imageUrl: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5', categoryId: coffee.id
        },
        {
            title: 'Colombian Supremo', slug: 'colombian-supremo',
            description: 'Balanced body, caramel sweetness. 250g whole beans.',
            priceCents: 1299, imageUrl: 'https://images.unsplash.com/photo-1445077100181-a33e9ac94db0', categoryId: coffee.id
        },
        {
            title: 'Matcha Ceremonial Grade', slug: 'matcha-ceremonial',
            description: 'Vivid green tea powder, smooth umami. 30g.',
            priceCents: 1799, imageUrl: 'https://images.unsplash.com/photo-1542326237-94b1c5a538d6', categoryId: tea.id
        },
        {
            title: 'Jasmine Green Tea', slug: 'jasmine-green-tea',
            description: 'Fragrant jasmine blossoms infused in green tea. 50g.',
            priceCents: 999, imageUrl: 'https://images.unsplash.com/photo-1544787219-c7f2517d8f52', categoryId: tea.id
        },
    ];

    for (const p of products) {
        await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
    }
    console.log('Seed complete.');
}

main().catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
