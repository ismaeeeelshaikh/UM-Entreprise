import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const searchTerm = "Premium Personalized 4-Piece Men’s Gift Set";

    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: "Men’s Gift Set" // Using a slightly broader search to catch subtle variations
            }
        },
        select: {
            id: true,
            name: true,
            category: true,
            images: true,
            createdAt: true
        }
    });

    return NextResponse.json({
        count: products.length,
        products: products
    });
}
