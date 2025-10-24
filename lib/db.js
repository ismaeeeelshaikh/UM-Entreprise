import mongoose from 'mongoose';

/**
 * Global cache for MongoDB connection to prevent multiple connections
 * in serverless environments (Vercel)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Atlas
 * @returns {Promise<typeof mongoose>} Mongoose connection instance
 */
async function connectDB() {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if promise doesn't exist
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    // Assuming MONGODB_URI is set in Vercel environment variables
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// ------------------------------------------------------------------
// ✅ FINAL FIX: Models are imported INSIDE the functions using dynamic import 
//               to prevent build-time serialization errors.
// ------------------------------------------------------------------

export async function fetchOrdersFromDB() {
  // 🛑 DELAYED IMPORT: Import Order Model only when function is called
  const OrderModel = (await import('./models/Order')).default; 
  
  await connectDB();
  // Use .lean() to ensure a plain JavaScript object array is returned
  const orders = await OrderModel.find({}).lean(); 
  return orders;
}

export async function fetchProductsFromDB() {
  // 🛑 DELAYED IMPORT: Import Product Model only when function is called
  const ProductModel = (await import('./models/Product')).default;
  
  await connectDB();
  // Use .lean() to ensure a plain JavaScript object array is returned
  const products = await ProductModel.find({}).lean();
  return products;
}

export default connectDB;
