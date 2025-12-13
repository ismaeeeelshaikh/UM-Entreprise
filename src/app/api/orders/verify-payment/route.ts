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
      saveAddress,
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

    // ✅ Update User's Default Address if requested
    if (saveAddress) {
      // 1. Unset other defaults
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      });

      // 2. Create new Address record
      await prisma.address.create({
        data: {
          userId: session.user.id,
          fullName: shippingAddress.fullName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          country: shippingAddress.country,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          isDefault: true,
        },
      });

      // 3. Update User model (Legacy support)
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          defaultPhone: shippingAddress.phone,
          defaultCountry: shippingAddress.country,
          defaultAddress: shippingAddress.address,
          defaultCity: shippingAddress.city,
          defaultState: shippingAddress.state,
          defaultPincode: shippingAddress.pincode,
        },
      });
    }

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
