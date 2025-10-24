import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

export async function GET() {
  await connectDB();
  const orders = await Order.find({});
  return NextResponse.json({ orders: JSON.parse(JSON.stringify(orders)) });
}
