
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(coupons);
    } catch (error) {
        console.error("COUPONS_GET_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { code, discountType, discountValue, minOrderValue, expiresAt } = body;

        if (!code || !discountType || !discountValue) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const existingCoupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (existingCoupon) {
            return new NextResponse("Coupon with this code already exists", { status: 400 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                discountValue: Number(discountValue),
                minOrderValue: Number(minOrderValue) || 0,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            }
        });

        return NextResponse.json(coupon);

    } catch (error) {
        console.error("COUPONS_CREATE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
