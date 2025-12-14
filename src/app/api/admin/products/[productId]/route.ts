import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> } // ✅ Changed to Promise
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ Await params first
    const { productId } = await params;

    const body = await request.json();
    console.log("[ADMIN_PRODUCT_PATCH_BODY]", JSON.stringify(body, null, 2));
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

    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        images,
        category,
        color: body.color || null,
        stock: (stock !== undefined && stock !== null && stock !== "") ? parseInt(String(stock)) : undefined,
        isCustomizable,
        customizationLabel,
      },
    });

    // Handle Variants Update if provided
    if (body.variants) {
      // Strategy: Delete existing variants and re-create them (Simple & Robust)
      // Transaction ensures data integrity
      await prisma.$transaction([
        prisma.productVariant.deleteMany({
          where: { productId: productId },
        }),
        prisma.productVariant.createMany({
          data: body.variants.map((variant: any) => ({
            productId: productId,
            color: variant.color,
            colorCode: variant.colorCode || null,
            price: variant.price ? parseFloat(variant.price) : null,
            stock: parseInt(variant.stock) || 0,
            images: variant.images || [],
          })),
        }),
      ]);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCT_PATCH_ERROR]", error);
    if (error instanceof Error) {
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> } // ✅ Changed to Promise
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ Await params first
    const { productId } = await params;

    // Delete associated OrderItems first to avoid foreign key constraints
    await prisma.orderItem.deleteMany({
      where: {
        productId: productId,
      },
    });

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
