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
        // Additional Coffee Products
        {
            title: 'Kenya AA', slug: 'kenya-aa',
            description: 'Wine-like acidity with black currant notes. 250g whole beans.',
            priceCents: 1699,
            imageUrl: '/images/Kenya.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Costa Rica Tarrazú', slug: 'costa-rica-tarrazu',
            description: 'Bright acidity with chocolate undertones. 250g whole beans.',
            priceCents: 1549,
            imageUrl: '/images/costarica.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Jamaica Blue Mountain', slug: 'jamaica-blue-mountain',
            description: 'Mild flavor with exceptional balance. Premium grade. 250g whole beans.',
            priceCents: 3999,
            imageUrl: '/images/jamaica-coffee.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Hawaiian Kona', slug: 'hawaiian-kona',
            description: 'Smooth, rich flavor with low acidity. 250g whole beans.',
            priceCents: 2999,
            imageUrl: '/images/hawai-coffee.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Yemen Mocha', slug: 'yemen-mocha',
            description: 'Wine-like body with fruity undertones. 250g whole beans.',
            priceCents: 2299,
            imageUrl: '/images/yemen-mocha.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Panama Geisha', slug: 'panama-geisha',
            description: 'Floral aroma with tea-like delicacy. Competition grade. 250g whole beans.',
            priceCents: 4999,
            imageUrl: '/images/panama-geisha.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Sumatra Mandheling', slug: 'sumatra-mandheling',
            description: 'Full-bodied with earthy, herbal notes. 250g whole beans.',
            priceCents: 1399,
            imageUrl: '/images/SumatraMandheling.jpg',
            categoryId: coffee.id
        },
        {
            title: 'Mexico Chiapas', slug: 'mexico-chiapas',
            description: 'Medium body with nutty, chocolate flavors. 250g whole beans.',
            priceCents: 1249,
            imageUrl: '/images/mexico-chiapas.jpg',
            categoryId: coffee.id
        },
        // Additional Tea Products
        {
            title: 'Darjeeling First Flush', slug: 'darjeeling-first-flush',
            description: 'Delicate muscatel flavor with astringent finish. 100g loose leaf.',
            priceCents: 1899,
            imageUrl: '/images/DarjeelingFirst.jpg',
            categoryId: tea.id
        },
        {
            title: 'Oolong Ti Kuan Yin', slug: 'oolong-ti-kuan-yin',
            description: 'Iron Goddess of Mercy with floral aroma. 50g loose leaf.',
            priceCents: 1599,
            imageUrl: '/images/TieGuanYinOolong-BlkLabel-Lifestyle01.jpg',
            categoryId: tea.id
        },
        {
            title: 'White Peony (Bai Mu Dan)', slug: 'white-peony',
            description: 'Subtle sweetness with light, refreshing taste. 50g loose leaf.',
            priceCents: 2199,
            imageUrl: '/images/Bai-Mu-Dan-4pc.jpg',
            categoryId: tea.id
        },
        {
            title: 'Pu-erh Aged 10 Years', slug: 'puerh-aged-10',
            description: 'Earthy, complex flavor from aged fermentation. 357g cake.',
            priceCents: 3499,
            imageUrl: '/images/712R5xyACvL._UF1000,1000_QL80_.jpg',
            categoryId: tea.id
        },
        {
            title: 'English Breakfast Premium', slug: 'english-breakfast-premium',
            description: 'Robust black tea blend perfect for morning. 100g loose leaf.',
            priceCents: 1199,
            imageUrl: '/images/090263.jpg',
            categoryId: tea.id
        },
        {
            title: 'Gyokuro Premium', slug: 'gyokuro-premium',
            description: 'Shade-grown Japanese green tea with umami richness. 50g loose leaf.',
            priceCents: 2999,
            imageUrl: '/images/gyokuro.jpg',
            categoryId: tea.id
        },
        {
            title: 'Lapsang Souchong', slug: 'lapsang-souchong',
            description: 'Distinctive smoky flavor from pine wood smoking. 100g loose leaf.',
            priceCents: 1399,
            imageUrl: '/images/packtb627_01.tmb-twg_rs1280.jpg',
            categoryId: tea.id
        },
        {
            title: 'Chamomile Flowers', slug: 'chamomile-flowers',
            description: 'Caffeine-free herbal tea with calming properties. 50g dried flowers.',
            priceCents: 899,
            imageUrl: '/images/glass-herbal-tea-with-chamomile-flowers-dark-wooden-background_1.jpg',
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
