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
            priceCents: 1499,
            imageUrl: '/images/eth.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Colombian Supremo', slug: 'colombian-supremo',
            description: 'Balanced body, caramel sweetness. 250g whole beans.',
            priceCents: 1299,
            imageUrl: '/images/lacas_coffee_0322_0332+2+1.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Matcha Ceremonial Grade', slug: 'matcha-ceremonial',
            description: 'Vivid green tea powder, smooth umami. 30g.',
            priceCents: 1799,
            imageUrl: '/images/Ceremonial_Matcha_Worth_It_1400x.jpg',
            categoryId: tea.id
        },
        {
            title: 'Jasmine Green Tea', slug: 'jasmine-green-tea',
            description: 'Fragrant jasmine blossoms infused in green tea. 50g.',
            priceCents: 999,
            imageUrl: '/images/jasmine.jpg',
            categoryId: tea.id
        },
        {
            title: 'Brazilian Santos', slug: 'brazilian-santos',
            description: 'Smooth, nutty flavor with low acidity. Perfect for espresso. 250g whole beans.',
            priceCents: 1199,
            imageUrl: '/images/brazil-santos.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Guatemala Antigua', slug: 'guatemala-antigua',
            description: 'Full-bodied with spicy and smoky undertones. 250g whole beans.',
            priceCents: 1599,
            imageUrl: '/images/guatemala-antigua.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Earl Grey Premium', slug: 'earl-grey-premium',
            description: 'Classic black tea with bergamot oil and cornflower petals. 100g loose leaf.',
            priceCents: 1299,
            imageUrl: '/images/earl-grey-premium.jpg',
            categoryId: tea.id
        },
        {
            title: 'Dragon Well Green Tea', slug: 'dragon-well-green',
            description: 'Delicate Chinese green tea with fresh, grassy notes. 50g loose leaf.',
            priceCents: 1099,
            imageUrl: '/images/dragon-well.jpg',
            categoryId: tea.id
        },
    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: { imageUrl: p.imageUrl },
            create: p,
        });
    }
    console.log('Seed complete.');
}

main().catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
