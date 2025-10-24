import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

export async function GET(request) {
  await connectDB();
  const orders = await Order.find({}); // ya as-required
  // Yeh line likhni hi hai!
  const safeOrders = JSON.parse(JSON.stringify(orders));
  return NextResponse.json({ orders: safeOrders });
}
