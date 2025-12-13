import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OtpType } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { email, code, type } = await req.json();

        if (!email || !code || !type) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const otpRecord = await prisma.otp.findFirst({
            where: {
                email,
                code,
                type: type as OtpType,
                expires: { gt: new Date() },
            },
        });

        if (!otpRecord) {
            return new NextResponse("Invalid or expired code", { status: 400 });
        }

        // Delete OTP after successful verification (optional, or keep until action consumed)
        // For now, we keep it to allow the next step (register/reset) to double check, 
        // OR we can trust the client flow. 
        // BETTER secure way: Return a signed token or just let the next step also verify the OTP + delete it.
        // Let's adopt a simple approach: This endpoint just verifies it's correct. 
        // The actual action (Register/Reset) will ALSO look for the valid OTP and delete it.

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("OTP Verify Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
