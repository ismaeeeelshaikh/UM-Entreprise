import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get total revenue
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
      },
      select: {
        totalAmount: true,
      },
    });

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // Get total orders count
    const totalOrders = await prisma.order.count();

    // Get total products count
    const totalProducts = await prisma.product.count();

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
