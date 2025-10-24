// app/api/admin/products/route.js

import { NextResponse } from 'next/server';
// ✅ FIX: Import the functions that are now correctly exported from db.js
import { fetchProductsFromDB } from '@/lib/db.js'; 

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await fetchProductsFromDB(); 

    // ✅ FIX: Serialize the complex Mongoose objects into plain, safe JSON
    const serializedProducts = JSON.parse(JSON.stringify(products));

    return NextResponse.json({ 
      success: true, 
      products: serializedProducts 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch products.', 
      error: error.message 
    }, { status: 500 });
  }
}