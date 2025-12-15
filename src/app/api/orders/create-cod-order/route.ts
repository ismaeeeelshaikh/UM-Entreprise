import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!session.user?.id) {
      return new NextResponse("User ID not found in session", { status: 400 });
    }

    const body = await request.json();
    const { items, totalAmount, shippingAddress, saveAddress } = body;

    // Create order with COD payment method
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: "PENDING",
        paymentMethod: "COD",
        paymentStatus: "COD", // Will be paid on delivery
        shippingAddress: JSON.stringify(shippingAddress),
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtPurchase: item.price,
            customizationText: item.customization || null,
            selectedColor: item.selectedColor || null,
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

    console.log("COD Order created successfully:", order.id);

    // ✅ Send Order Notification Email
    try {
      await sendOrderNotification(order, session.user.email || "Unknown Customer");

      // ✅ Send Telegram Notification
      const telegramMessage = `
<b>📦 New COD Order Received!</b>
<b>Order ID:</b> #${order.id.slice(-6)}
<b>Amount:</b> ₹${order.totalAmount}
<b>Customer:</b> ${shippingAddress.fullName}
<b>Payment:</b> Cash on Delivery
      `;
      await import("@/lib/telegram").then(mod => mod.sendTelegramNotification(telegramMessage));

    } catch (emailError) {
      console.error("Failed to send order notification:", emailError);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("[COD_ORDER_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
