// app/api/admin/orders/route.js

import { NextResponse } from 'next/server';
// ✅ FIX: Import the functions that are now correctly exported from db.js
import { fetchOrdersFromDB } from '@/lib/db.js'; 

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await fetchOrdersFromDB(); 

    // ✅ FIX: Serialize the complex Mongoose objects into plain, safe JSON
    const serializedOrders = JSON.parse(JSON.stringify(orders));

    return NextResponse.json({ 
      success: true, 
      orders: serializedOrders 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch orders.', 
      error: error.message 
    }, { status: 500 });
  }
}