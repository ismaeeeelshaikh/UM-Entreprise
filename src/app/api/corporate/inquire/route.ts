import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, company, email, product, quantity, message } = body;

        if (!name || !email || !product || !quantity) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Save to Database
        const inquiry = await prisma.corporateInquiry.create({
            data: {
                name,
                company: company || "N/A",
                email,
                product,
                quantity,
                message,
                status: "NEW",
            },
        });

        // 2. Send Email Notification to Admin
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SERVER_USER,
            to: process.env.EMAIL_SERVER_USER, // Send to yourself/admin
            subject: `New Corporate Inquiry: ${company || name}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e293b;">New Corporate Inquiry 🚀</h2>
          <p>You have received a new bulk order request.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Company:</td><td>${company || "N/A"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td>${email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Product:</td><td>${product}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Quantity:</td><td>${quantity}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td>${message || "No message"}</td></tr>
          </table>

          <div style="margin-top: 24px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/inquiries" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View in Admin Panel</a>
          </div>
        </div>
      `,
        };

        // Attempt to send email, but don't block response if it fails
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Failed to send admin notification email:", emailError);
        }

        return NextResponse.json({ success: true, inquiry }, { status: 201 });
    } catch (error) {
        console.error("Error submitting corporate inquiry:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
