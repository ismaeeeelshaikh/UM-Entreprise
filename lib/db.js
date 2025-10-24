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
// FINAL FIX UTILITY: Simplified Defensive Model Loading
// This function uses the basic dynamic require path, which is compatible
// with the module.exports change made in Order.js and Product.js.
// ------------------------------------------------------------------

/**
 * Synchronously loads a Mongoose model using require().
 * @param {string} modelName - The model file name (e.g., 'Order').
 * @returns {mongoose.Model} The Mongoose Model instance.
 */
const getModel = (modelName) => {
  // ✅ Simplified Fix: Use a dynamic require string 
  // Next.js understands this is a server-side dependency.
  return require(`@/lib/models/${modelName}`);
};

const executeDBQuery = async (ModelName, query = {}) => {
  await connectDB();
  
  // Get the Mongoose Model using the isolation pattern
  const Model = getModel(ModelName); 

  // Execute find query and use .lean() for plain JSON data
  const data = await Model.find(query).lean();
  return data;
};

export async function fetchOrdersFromDB() {
  // Pass the model file name (Order)
  const orders = await executeDBQuery('Order', {});
  return orders;
}

export async function fetchProductsFromDB() {
  // Pass the model file name (Product)
  const products = await executeDBQuery('Product', {});
  return products;
}

export default connectDB;
