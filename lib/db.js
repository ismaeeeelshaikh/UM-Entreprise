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
// FINAL FIX: Highly Defensive Data Fetching
// We use an intermediate function to wrap the database logic,
// forcing strict server-side execution and ensuring the .lean() result is serialized.
// ------------------------------------------------------------------

const executeDBQuery = async (Model, query = {}) => {
  await connectDB();
  // Execute find query and use .lean()
  const data = await Model.find(query).lean();
  return data;
};

export async function fetchOrdersFromDB() {
  // Call the defensive execution wrapper
  const orders = await executeDBQuery(OrderModel, {});
  return orders;
}

export async function fetchProductsFromDB() {
  // Call the defensive execution wrapper
  const products = await executeDBQuery(ProductModel, {});
  return products;
}

export default connectDB;
