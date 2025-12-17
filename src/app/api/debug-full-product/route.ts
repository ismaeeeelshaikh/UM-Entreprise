import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const productId = "693ea72afaeeffdde7939a23";
    // Fetch EVERYTHING regarding this product
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            reviews: true,
            variants: true
        }
    });
    return NextResponse.json(product);
}
