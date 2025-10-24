// app/api/admin/products/route.js

import { NextResponse } from 'next/server';
import { fetchProductsFromDB } from '@/lib/db.js'; 

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await fetchProductsFromDB(); 

    // ✅ Serialization kept for absolute safety, though .lean() helps immensely
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
