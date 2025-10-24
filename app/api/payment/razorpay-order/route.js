import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { amount } = await request.json();

  // Validate amount
  if (!amount) {
    return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
  }

  // Create Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `rcptid_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
