import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Fetch user's wishlist
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const wishlist = await prisma.wishlist.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        category: true,
                        isCustomizable: true,
                        variants: {
                            select: {
                                price: true,
                                images: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Format for frontend
        const products = wishlist.map(item => item.product);

        return NextResponse.json(products);
    } catch (error) {
        console.error("[WISHLIST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST: Toggle Wishlist (Add/Remove)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { productId } = body;

        if (!productId) {
            return new NextResponse("Product ID required", { status: 400 });
        }

        // Check if exists
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        if (existing) {
            // Remove
            await prisma.wishlist.delete({
                where: {
                    id: existing.id,
                },
            });
            return NextResponse.json({ isWishlisted: false, message: "Removed from wishlist" });
        } else {
            // Add
            await prisma.wishlist.create({
                data: {
                    userId: session.user.id,
                    productId,
                },
            });
            return NextResponse.json({ isWishlisted: true, message: "Added to wishlist" });
        }

    } catch (error) {
        console.error("[WISHLIST_TOGGLE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
