
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { code, cartTotal } = await request.json();

        if (!code) {
            return new NextResponse("Coupon code is required", { status: 400 });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }, // Case insensitive check
        });

        if (!coupon) {
            return NextResponse.json({ valid: false, message: "Invalid coupon code" }, { status: 404 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ valid: false, message: "This coupon is inactive" }, { status: 400 });
        }

        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return NextResponse.json({ valid: false, message: "This coupon has expired" }, { status: 400 });
        }

        if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
            return NextResponse.json({
                valid: false,
                message: `Minimum order value of ₹${coupon.minOrderValue} required`
            }, { status: 400 });
        }

        // Calculate Discount
        let discountAmount = 0;
        if (coupon.discountType === "PERCENTAGE") {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed total
        discountAmount = Math.min(discountAmount, cartTotal);

        return NextResponse.json({
            valid: true,
            discountAmount,
            finalTotal: cartTotal - discountAmount,
            message: "Coupon applied successfully!"
        });

    } catch (error) {
        console.error("COUPON_VALIDATE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
