import mongoose from 'mongoose';
// ⚠️ IMPORTANT: Assuming these paths are now correct based on your file structure:
import OrderModel from './models/Order'; 
import ProductModel from './models/Product';

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

// ----------------------------------------------------
// ✅ FIX: Added .lean() to return plain JS objects for safer serialization
// ----------------------------------------------------

export async function fetchOrdersFromDB() {
  await connectDB();
  // Use .lean() to ensure a plain JavaScript object array is returned
  const orders = await OrderModel.find({}).lean(); 
  return orders;
}

export async function fetchProductsFromDB() {
  await connectDB();
  // Use .lean() to ensure a plain JavaScript object array is returned
  const products = await ProductModel.find({}).lean();
  return products;
}

export default connectDB;
