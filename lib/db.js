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
// ✅ FINAL FIX ATTEMPT: Using require() for maximum build-time safety.
// ------------------------------------------------------------------

// Helper function to safely load a model without crashing the build
const safeImportModel = async (modelPath) => {
    // We use dynamic require() here instead of import() for slightly better compatibility
    // with how Node/Next.js handles CommonJS modules during the build phase.
    const modelModule = await require(modelPath);
    return modelModule.default || modelModule;
};

export async function fetchOrdersFromDB() {
  // Use a relative require path. Ensure this path is correct: './models/Order'
  const OrderModel = await safeImportModel('./models/Order');
  
  await connectDB();
  // Use .lean() to ensure a plain JavaScript object array is returned
  const orders = await OrderModel.find({}).lean(); 
  return orders;
}

export async function fetchProductsFromDB() {
  // Use a relative require path. Ensure this path is correct: './models/Product'
  const ProductModel = await safeImportModel('./models/Product');
  
  await connectDB();
  // Use .lean() to ensure a plain JavaScript object array is returned
  const products = await ProductModel.find({}).lean();
  return products;
}

export default connectDB;
