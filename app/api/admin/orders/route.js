// app/api/admin/orders/route.js

import { NextResponse } from 'next/server';
// ⚠️ IMPORTANT: Replace this placeholder with your actual Order model and database connection logic
import { fetchOrdersFromDB } from '@/lib/db.js'; 

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // ⚠️ STEP 1: Fetch the orders (this returns Mongoose Document objects)
    const orders = await fetchOrdersFromDB(); 

    // ✅ STEP 2: FIX - Serialize the complex Mongoose objects into plain, safe JSON
    // This removes unsupported types (like Mongoose properties) that crash the build.
    const serializedOrders = JSON.parse(JSON.stringify(orders));

    return NextResponse.json({ 
      success: true, 
      orders: serializedOrders 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    // You should use your own error handling and authentication checks here
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch orders.', 
      error: error.message 
    }, { status: 500 });
  }
}