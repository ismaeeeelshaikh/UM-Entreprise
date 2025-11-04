import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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
    const { items, totalAmount, shippingAddress } = body;

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
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log("COD Order created successfully:", order.id);

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("[COD_ORDER_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
