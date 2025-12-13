import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { email, otp, password } = await request.json();

        if (!email || !otp || !password) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Verify OTP again (Double check for security)
        const otpRecord = await prisma.otp.findFirst({
            where: {
                email,
                code: otp,
                type: "RESET",
                expires: { gt: new Date() },
            },
        });

        if (!otpRecord) {
            return new NextResponse("Invalid or expired code", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { email },
            data: { hashedPassword },
        });

        // Cleanup OTP
        await prisma.otp.delete({ where: { id: otpRecord.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
