import mongoose from 'mongoose';
// ⚠️ IMPORTANT: Import your Mongoose Models here (replace paths with your actual model file paths)
import OrderModel from './models/Order';     
import ProductModel from './models/Product';

/**
 * Global cache for MongoDB connection... (KEEP the original connection logic)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB Atlas
 */
async function connectDB() {
  // ... (Keep the rest of your original connectDB function code)
  if (cached.conn) {
    return cached.conn;
  }
  // ... (rest of the connection logic)
  if (!cached.promise) { /* ... */ }
  // ...
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// ----------------------------------------------------
// 🛑 NEW: Add and Export the fetching functions to fix the build error
// ----------------------------------------------------

export async function fetchOrdersFromDB() {
  await connectDB();
  // ⚠️ Use your actual Mongoose Model for orders here
  const orders = await OrderModel.find({});
  return orders;
}

export async function fetchProductsFromDB() {
  await connectDB();
  // ⚠️ Use your actual Mongoose Model for products here
  const products = await ProductModel.find({});
  return products;
}

export default connectDB;