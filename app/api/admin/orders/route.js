import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
// Yahan koi fetchProductsFromDB import NAHI hona chahiye!

export async function GET(request) {
  await connectDB();
  const orders = await Order.find({});
  const plainOrders = JSON.parse(JSON.stringify(orders));
  return NextResponse.json({ orders: plainOrders });
}
