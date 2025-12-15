import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { reviewId } = await params;
        const body = await request.json();
        const { rating, comment, images } = body;

        // Check ownership
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!existingReview) {
            return new NextResponse("Review not found", { status: 404 });
        }

        if (existingReview.userId !== session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                rating,
                comment,
                images,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error("[REVIEW_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { reviewId } = await params;

        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!existingReview) {
            return new NextResponse("Review not found", { status: 404 });
        }

        // Admin can also delete? For now, restrict to owner.
        if (existingReview.userId !== session.user.id && session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.review.delete({
            where: { id: reviewId },
        });

        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        console.error("[REVIEW_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
