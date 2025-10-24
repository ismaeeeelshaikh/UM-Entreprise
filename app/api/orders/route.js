import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

// POST: create new order
export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const order = await Order.create(body);
  return NextResponse.json(order);
}

// GET: get all orders for a user
export async function GET(request) {
  await connectDB();
  const userId = request.nextUrl.searchParams.get('user');
  if (!userId) {
    return NextResponse.json({ orders: [] });
  }
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}

// PATCH: cancel order
export async function PATCH(request) {
  await connectDB();
  const { orderId, userId, reason } = await request.json();
  const idValue = typeof orderId === "object" && orderId.$oid ? orderId.$oid : orderId;
  const updated = await Order.findOneAndUpdate(
    { _id: idValue, user: userId, status: { $in: ['cod', 'paid'] } },
    { status: 'cancelled', cancelReason: reason },
    { new: true }
  );
  if (!updated) {
    return NextResponse.json({ error: 'Order not found or cannot cancel' }, { status: 400 });
  }
  return NextResponse.json({ success: true, order: updated });
}
