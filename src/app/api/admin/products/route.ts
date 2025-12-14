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

    if (!name || !description || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const hasVariants = body.variants && body.variants.length > 0;

    if (!hasVariants && (!price || !images || !stock)) {
      return new NextResponse("Missing required fields for simple product", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: price ? parseFloat(price) : 0,
        images: images || [],
        category,
        color: body.color || null,
        stock: stock ? parseInt(stock) : 0,
        isCustomizable: isCustomizable || false,
        customizationLabel: customizationLabel || null,
        variants: body.variants && body.variants.length > 0 ? {
          create: body.variants.map((variant: any) => ({
            color: variant.color,
            colorCode: variant.colorCode || null,
            price: variant.price ? parseFloat(variant.price) : null,
            stock: parseInt(variant.stock) || 0,
            images: variant.images || [],
          }))
        } : undefined,
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
      include: {
        variants: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
