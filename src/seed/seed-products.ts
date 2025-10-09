import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('🌱 Seeding products...');

  try {
    // First, let's create some vendors and categories if they don't exist
    const vendor1 = await prisma.vendor.upsert({
      where: { id: 'vendor-1' },
      update: {},
      create: {
        id: 'vendor-1',
        name: 'TechHub Electronics',
        slug: 'techhub-electronics',
        description: 'Premium electronics and gadgets',
        owner_user_id: 'admin-user', // This should be an actual user ID
        seller_type: 'RETAILER',
        status: 'APPROVED',
        is_active: true,
      },
    });

    const vendor2 = await prisma.vendor.upsert({
      where: { id: 'vendor-2' },
      update: {},
      create: {
        id: 'vendor-2',
        name: 'Fashion Forward',
        slug: 'fashion-forward',
        description: 'Trendy fashion and lifestyle products',
        owner_user_id: 'admin-user',
        seller_type: 'RETAILER',
        status: 'APPROVED',
        is_active: true,
      },
    });

    const category1 = await prisma.category.upsert({
      where: { id: 'cat-1' },
      update: {},
      create: {
        id: 'cat-1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
        path: 'electronics',
        is_active: true,
      },
    });

    const category2 = await prisma.category.upsert({
      where: { id: 'cat-2' },
      update: {},
      create: {
        id: 'cat-2',
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and fashion accessories',
        path: 'fashion',
        is_active: true,
      },
    });

    // Create sample products that match frontend data
    const product1 = await prisma.catalogProduct.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        vendor_id: vendor1.id,
        category_id: category1.id,
        title: 'Premium Headphones',
        slug: 'premium-headphones',
        description: 'Experience crystal-clear audio with our premium wireless headphones.',
        status: 'ACTIVE',
        is_active: true,
        featured: true,
        features: ['Wireless', 'Noise Cancelling', '30-hour battery'],
        available_locations: ['Johannesburg', 'Cape Town', 'Durban'],
      },
    });

    const product2 = await prisma.catalogProduct.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        vendor_id: vendor2.id,
        category_id: category2.id,
        title: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description: 'Premium 100% organic cotton t-shirt with a comfortable fit.',
        status: 'ACTIVE',
        is_active: true,
        featured: false,
        features: ['100% Organic Cotton', 'Comfortable Fit', 'Machine Washable'],
        available_locations: ['Johannesburg', 'Cape Town'],
      },
    });

    const product3 = await prisma.catalogProduct.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        vendor_id: vendor1.id,
        category_id: category1.id,
        title: 'Smart Watch',
        slug: 'smart-watch',
        description: 'Advanced smartwatch with health monitoring and fitness tracking.',
        status: 'ACTIVE',
        is_active: true,
        featured: true,
        features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant'],
        available_locations: ['Johannesburg', 'Cape Town', 'Durban'],
      },
    });

    // Create variants for the headphones
    await prisma.productVariant.upsert({
      where: {
        id: 'variant-1-1'
      },
      update: {},
      create: {
        id: 'variant-1-1',
        product_id: '1',
        sku: 'PH-BLACK',
        title: 'Premium Headphones - Midnight Black',
        price_cents: 7999, // R79.99
        compare_at_price_cents: 9999, // R99.99
        stock_quantity: 15,
        attributes: { color: 'black' },
        available_locations: ['Johannesburg', 'Cape Town', 'Durban'],
      },
    });

    await prisma.productVariant.upsert({
      where: {
        id: 'variant-1-2'
      },
      update: {},
      create: {
        id: 'variant-1-2',
        product_id: '1',
        sku: 'PH-GRAY',
        title: 'Premium Headphones - Space Gray',
        price_cents: 7999, // R79.99
        stock_quantity: 8,
        attributes: { color: 'gray' },
        available_locations: ['Johannesburg', 'Cape Town'],
      },
    });

    await prisma.productVariant.upsert({
      where: {
        id: 'variant-1-3'
      },
      update: {},
      create: {
        id: 'variant-1-3',
        product_id: '1',
        sku: 'PH-ROSE',
        title: 'Premium Headphones - Rose Gold',
        price_cents: 8999, // R89.99
        stock_quantity: 5,
        attributes: { color: 'rose' },
        available_locations: ['Cape Town', 'Durban'],
      },
    });

    console.log('✅ Products seeded successfully!');
    console.log('📱 Product 1 (Headphones):', product1.id);
    console.log('👕 Product 2 (T-Shirt):', product2.id);
    console.log('⌚ Product 3 (Smart Watch):', product3.id);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedProducts().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
