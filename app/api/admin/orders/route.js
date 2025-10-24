import { NextResponse } from 'next/server';
import { fetchProductsFromDB } from '@/lib/db.js'; 

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // This function inside lib/db.js handles the model loading and the .lean() query
    const products = await fetchProductsFromDB(); 

    // Serialization is kept as a final safety measure
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
