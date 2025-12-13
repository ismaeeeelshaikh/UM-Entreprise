import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ Add debug logging
    console.log("Session user:", session.user);
    console.log("User ID:", session.user.id);

    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      items,
      totalAmount,
      shippingAddress,
    } = body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // ✅ Validate userId exists
    if (!session.user?.id) {
      console.error("User ID is missing from session:", session);
      return new NextResponse("User ID not found in session", { status: 400 });
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id, // ✅ Now validated
        totalAmount,
        status: "PENDING",
        paymentId: razorpay_payment_id,
        paymentStatus: "PAID",
        shippingAddress: JSON.stringify(shippingAddress),
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtPurchase: item.price,
            customizationText: item.customization || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true, // ✅ Include product details for email
          },
        },
      },
    });

    console.log("Order created successfully:", order.id);

    // ✅ Send Order Notification Email
    try {
      await sendOrderNotification(order, session.user.email || "Unknown Customer");
    } catch (emailError) {
      console.error("Failed to send order notification:", emailError);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("[PAYMENT_VERIFICATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
