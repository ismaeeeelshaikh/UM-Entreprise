import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, otp } = body;

    if (!email || !name || !password || !otp) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify OTP
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        code: otp,
        type: "REGISTER",
        expires: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      return new NextResponse("Invalid or expired verification code", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 422 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        role: "USER" as any,
      },
    });

    // Cleanup OTP
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
