import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      images,
      category,
      stock,
      isCustomizable,
      customizationLabel,
    } = body;

    if (!name || !description || !price || !images || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images,
        category,
        color: body.color || null,
        stock: parseInt(stock) || 0,
        isCustomizable: isCustomizable || false,
        customizationLabel: customizationLabel || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
