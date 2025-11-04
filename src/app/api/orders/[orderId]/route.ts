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
