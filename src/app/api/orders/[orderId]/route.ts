import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id, // Ensure user can only see their own orders
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                description: true,
                images: true,
                variants: true, // ✅ Include variants to get variant-specific images
              },
            },
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }


    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_DETAIL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { orderId } = await params;
    const body = await request.json();
    const { status } = body;

    // Only allow cancellation updates here
    if (status !== "CANCELED") {
      return new NextResponse("Invalid status update", { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Strict Status Check: Can only cancel if PENDING or PROCESSING
    if (!["PENDING", "PROCESSING"].includes(order.status)) {
      return new NextResponse("Order cannot be canceled at this stage", { status: 400 });
    }

    // Handle Refund for Online Payments
    if (order.paymentMethod === "ONLINE" && order.paymentId) {
      const CASHFREE_API_URL = process.env.CASHFREE_ENV === "PRODUCTION"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

      const refundId = `refund_${orderId}_${Date.now()}`;

      console.log(`[REFUND_INIT] Initiating refund for Order ${order.paymentId} (DB Order: ${orderId})`);

      const refundResponse = await fetch(`${CASHFREE_API_URL}/${order.paymentId}/refunds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify({
          refund_amount: order.totalAmount,
          refund_id: refundId,
          refund_note: "Customer requested cancellation via website",
        }),
      });

      const refundData = await refundResponse.json();

      if (!refundResponse.ok) {
        console.error("[REFUND_ERROR]", refundData);
        // We throw error here to prevent the order from being cancelled if refund fails
        // This stops the user from thinking it's cancelled when money isn't returned
        throw new Error(refundData.message || "Failed to initiate refund");
      }

      console.log("[REFUND_SUCCESS]", refundData);
    }

    // Update Status in DB
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "CANCELED",
      },
    });

    // Send Email Notification
    const { sendCancellationNotification } = await import("@/lib/mail");
    await sendCancellationNotification(
      orderId,
      session.user.email || "Unknown",
      order.totalAmount,
      order.paymentMethod
    );

    // ✅ Send Telegram Notification for Cancellation
    const { sendTelegramNotification } = await import("@/lib/telegram");
    const cancellationMessage = `
<b>❌ Order Cancelled</b>

<b>Order ID:</b> #${orderId.slice(-8)}
<b>Customer:</b> ${session.user.name || session.user.email}
<b>Amount:</b> ₹${order.totalAmount}
<b>Payment Method:</b> ${order.paymentMethod}
<b>Refund Status:</b> ${order.paymentMethod === "ONLINE" ? "Initiated" : "N/A"}

<i>Customer initiated cancellation via website.</i>
    `;
    await sendTelegramNotification(cancellationMessage);

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("[ORDER_CANCEL]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
