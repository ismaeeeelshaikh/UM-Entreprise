
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const coupon = await prisma.coupon.findFirst({
            where: {
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!coupon) {
            return NextResponse.json({ found: false });
        }

        return NextResponse.json({
            found: true,
            coupon: {
                code: coupon.code,
                discountValue: coupon.discountValue,
                discountType: coupon.discountType
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
