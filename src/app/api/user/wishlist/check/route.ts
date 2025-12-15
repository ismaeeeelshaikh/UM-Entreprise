import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ isWishlisted: false });
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return new NextResponse("Product ID required", { status: 400 });
        }

        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ isWishlisted: !!existing });
    } catch (error) {
        console.error("[WISHLIST_CHECK]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
