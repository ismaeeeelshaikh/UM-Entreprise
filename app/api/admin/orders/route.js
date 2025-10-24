import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

export async function GET(request) {
  await connectDB();
  const orders = await Order.find({});

  // Is line ko likhna ZARURI hai:
  const plainOrders = JSON.parse(JSON.stringify(orders));
  return NextResponse.json({ orders: plainOrders });
}
