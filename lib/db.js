import mongoose from 'mongoose';
// 🛑 IMPORTANT: These imports MUST match your file names exactly (Order.js/Product.js)
// ✅ CONFIRMED: These match your 'Order' and 'Product' files.
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
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

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
// FINAL FIX: Cleaned up fetching using .lean() and direct model access
// ------------------------------------------------------------------

export async function fetchOrdersFromDB() {
  await connectDB();
  // Ensure the model name here matches the imported variable name (OrderModel)
  // .lean() ensures pure JSON for serialization
  const orders = await OrderModel.find({}).lean(); 
  return orders;
}

export async function fetchProductsFromDB() {
  await connectDB();
  // Ensure the model name here matches the imported variable name (ProductModel)
  // .lean() ensures pure JSON for serialization
  const products = await ProductModel.find({}).lean();
  return products;
}

export default connectDB;
