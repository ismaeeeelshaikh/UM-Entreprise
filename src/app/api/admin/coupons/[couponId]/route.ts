
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ couponId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { couponId } = await params;

        if (!session || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!couponId) {
            return new NextResponse("Coupon ID is required", { status: 400 });
        }

        await prisma.coupon.delete({
            where: { id: couponId }
        });

        return NextResponse.json({ message: "Coupon deleted" });

    } catch (error) {
        console.error("COUPON_DELETE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
