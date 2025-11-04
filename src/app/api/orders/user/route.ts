import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[USER_ORDERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
