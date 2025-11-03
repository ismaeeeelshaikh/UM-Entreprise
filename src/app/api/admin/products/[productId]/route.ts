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
        stock: stock !== undefined ? parseInt(stock) : undefined,
        isCustomizable,
        customizationLabel,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCT_PATCH]", error);
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
