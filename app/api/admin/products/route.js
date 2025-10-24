// app/api/admin/products/route.js

import { NextResponse } from 'next/server';
// ⚠️ IMPORTANT: Replace this placeholder with your actual Product model and database connection logic
import { fetchProductsFromDB } from '@/lib/db.js'; 

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ⚠️ STEP 1: Fetch the products (this returns Mongoose Document objects)
    const products = await fetchProductsFromDB(); 

    // ✅ STEP 2: FIX - Serialize the complex Mongoose objects into plain, safe JSON
    // This removes unsupported types (like Mongoose properties) that crash the build.
    const serializedProducts = JSON.parse(JSON.stringify(products));

    return NextResponse.json({ 
      success: true, 
      products: serializedProducts 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching products:", error);
    // You should use your own error handling and authentication checks here
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch products.', 
      error: error.message 
    }, { status: 500 });
  }
}