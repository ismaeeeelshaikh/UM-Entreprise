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
// FINAL FIX UTILITY: Highly Defensive Data Fetching
// This pattern isolates the Mongoose models from Next.js build-time serialization.
// ------------------------------------------------------------------

// Utility to synchronously require the model definition using a dynamic path
const getModel = (modelName) => {
  // Use require.resolve to let Webpack correctly find the path, 
  // but use a dynamic string to prevent static bundling.
  return require(require.resolve('./models/' + modelName));
};

const executeDBQuery = async (ModelName, query = {}) => {
  await connectDB();
  
  // Get the Mongoose Model synchronously using the isolation pattern
  const Model = getModel(ModelName); 

  // Execute find query and use .lean() for plain JSON data
  const data = await Model.find(query).lean();
  return data;
};

export async function fetchOrdersFromDB() {
  // Pass the model file name (without .js extension)
  const orders = await executeDBQuery('Order', {});
  return orders;
}

export async function fetchProductsFromDB() {
  // Pass the model file name (without .js extension)
  const products = await executeDBQuery('Product', {});
  return products;
}

export default connectDB;
