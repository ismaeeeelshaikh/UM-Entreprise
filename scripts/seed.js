require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models (using require for Node.js)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  basePrice: Number,
  images: Array,
  customizationOptions: Object,
  stock: Number,
  featured: Boolean,
  active: Boolean,
  tags: [String],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: 'Premium Leather Wallet',
    description: 'Handcrafted genuine leather wallet with custom engraving option',
    category: 'wallet',
    basePrice: 799,
    images: [
      { url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', publicId: 'sample1' }
    ],
    customizationOptions: {
      engraving: {
        available: true,
        maxCharacters: 20,
        additionalPrice: 150,
      },
      photoUpload: {
        available: false,
        additionalPrice: 0,
      },
      colorOptions: [
        { name: 'Black', hexCode: '#000000', additionalPrice: 0 },
        { name: 'Brown', hexCode: '#8B4513', additionalPrice: 50 },
      ],
    },
    stock: 50,
    featured: true,
    active: true,
    tags: ['leather', 'premium', 'gift'],
  },
  {
    name: 'Personalized Metal Pen',
    description: 'Elegant metal pen with custom name engraving',
    category: 'pen',
    basePrice: 499,
    images: [
      { url: 'https://images.unsplash.com/photo-1565022536102-f7a5a2ff5190?w=500', publicId: 'sample2' }
    ],
    customizationOptions: {
      engraving: {
        available: true,
        maxCharacters: 15,
        additionalPrice: 100,
      },
      photoUpload: {
        available: false,
        additionalPrice: 0,
      },
      colorOptions: [
        { name: 'Silver', hexCode: '#C0C0C0', additionalPrice: 0 },
        { name: 'Gold', hexCode: '#FFD700', additionalPrice: 100 },
      ],
    },
    stock: 100,
    featured: true,
    active: true,
    tags: ['pen', 'metal', 'professional'],
  },
  {
    name: 'Custom Photo Keychain',
    description: 'Acrylic keychain with your photo and text',
    category: 'keychain',
    basePrice: 199,
    images: [
      { url: 'https://images.unsplash.com/photo-1625821766081-b76c6073b2b7?w=500', publicId: 'sample3' }
    ],
    customizationOptions: {
      engraving: {
        available: true,
        maxCharacters: 10,
        additionalPrice: 50,
      },
      photoUpload: {
        available: true,
        additionalPrice: 100,
      },
      colorOptions: [],
    },
    stock: 200,
    featured: true,
    active: true,
    tags: ['keychain', 'photo', 'affordable'],
  },
  {
    name: 'Couple Ring Set',
    description: 'Matching stainless steel rings with engraving',
    category: 'ring',
    basePrice: 1299,
    images: [
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500', publicId: 'sample4' }
    ],
    customizationOptions: {
      engraving: {
        available: true,
        maxCharacters: 30,
        additionalPrice: 200,
      },
      photoUpload: {
        available: false,
        additionalPrice: 0,
      },
      colorOptions: [
        { name: 'Silver', hexCode: '#C0C0C0', additionalPrice: 0 },
        { name: 'Rose Gold', hexCode: '#B76E79', additionalPrice: 200 },
      ],
    },
    stock: 30,
    featured: true,
    active: true,
    tags: ['ring', 'couple', 'wedding'],
  },
  {
    name: 'Personalized Bangle',
    description: 'Elegant bangle with custom message engraving',
    category: 'bangle',
    basePrice: 899,
    images: [
      { url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', publicId: 'sample5' }
    ],
    customizationOptions: {
      engraving: {
        available: true,
        maxCharacters: 25,
        additionalPrice: 150,
      },
      photoUpload: {
        available: false,
        additionalPrice: 0,
      },
      colorOptions: [
        { name: 'Gold', hexCode: '#FFD700', additionalPrice: 0 },
        { name: 'Silver', hexCode: '#C0C0C0', additionalPrice: 0 },
      ],
    },
    stock: 40,
    featured: false,
    active: true,
    tags: ['bangle', 'jewelry', 'elegant'],
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@umentreprise.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('👤 Created admin user (admin@umentreprise.com / admin123)');

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    await User.create({
      name: 'Test Customer',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'user',
    });
    console.log('👤 Created test customer (customer@example.com / customer123)');

    // Create products
    await Product.insertMany(sampleProducts);
    console.log('📦 Created sample products');

    console.log('✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@umentreprise.com / admin123');
    console.log('Customer: customer@example.com / customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
