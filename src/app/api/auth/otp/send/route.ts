import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mail";
import { OtpType } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { email, type } = await req.json();

        if (!email || !type) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        // Generate 6 digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store in DB (delete old ones first for cleanup)
        await prisma.otp.deleteMany({
            where: { email, type: type as OtpType },
        });

        await prisma.otp.create({
            data: {
                email,
                code,
                type: type as OtpType,
                expires,
            },
        });

        // Send email
        await sendOtpEmail(email, code, type as OtpType);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("OTP Send Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
