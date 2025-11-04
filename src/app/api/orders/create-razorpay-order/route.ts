import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("[RAZORPAY_ORDER_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
