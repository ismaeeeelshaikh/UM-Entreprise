import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/mail";

const CASHFREE_API_URL = process.env.CASHFREE_ENV === "PRODUCTION"
    ? "https://api.cashfree.com/pg/orders"
    : "https://sandbox.cashfree.com/pg/orders";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const {
            orderId,
            items,
            totalAmount,
            shippingAddress,
            saveAddress,
        } = body;

        // Verify payment with Cashfree
        const response = await fetch(`${CASHFREE_API_URL}/${orderId}/payments`, {
            headers: {
                "x-client-id": process.env.CASHFREE_APP_ID!,
                "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
                "x-api-version": "2023-08-01",
            },
        });

        const payments = await response.json();

        if (!response.ok) {
            throw new Error("Failed to fetch payment details from Cashfree");
        }

        // Find a successful transaction
        const successfulTransaction = payments.find(
            (tx: any) => tx.payment_status === "SUCCESS"
        );

        if (!successfulTransaction) {
            return new NextResponse("Payment Verification Failed", { status: 400 });
        }

        // Validate userId exists
        if (!session.user?.id) {
            return new NextResponse("User ID not found in session", { status: 400 });
        }

        // Check if order already exists to avoid duplicates
        const existingOrder = await prisma.order.findFirst({
            where: { paymentId: successfulTransaction.cf_payment_id }
        });

        if (existingOrder) {
            return NextResponse.json({ success: true, orderId: existingOrder.id });
        }

        // Create order in database
        const order = await prisma.order.create({
            data: {
                userId: session.user.id,
                totalAmount,
                status: "PENDING",
                paymentMethod: "ONLINE",
                paymentId: orderId, // Saving Cashfree Order ID to enable Refunds later
                paymentStatus: successfulTransaction.payment_status,
                shippingAddress: JSON.stringify(shippingAddress),
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        priceAtPurchase: item.price,
                        customizationText: item.customization || null,
                        selectedColor: item.selectedColor || null,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Update User's Default Address if requested
        if (saveAddress) {
            // 1. Unset other defaults
            await prisma.address.updateMany({
                where: { userId: session.user.id, isDefault: true },
                data: { isDefault: false },
            });

            // 2. Create new Address record
            await prisma.address.create({
                data: {
                    userId: session.user.id,
                    fullName: shippingAddress.fullName,
                    email: shippingAddress.email,
                    phone: shippingAddress.phone,
                    country: shippingAddress.country,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.pincode,
                    isDefault: true,
                },
            });

            // 3. Update User model (Legacy support)
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    defaultPhone: shippingAddress.phone,
                    defaultCountry: shippingAddress.country,
                    defaultAddress: shippingAddress.address,
                    defaultCity: shippingAddress.city,
                    defaultState: shippingAddress.state,
                    defaultPincode: shippingAddress.pincode,
                },
            });
        }

        // Send Order Notification Email
        try {
            await sendOrderNotification(order, session.user.email || "Unknown Customer");
        } catch (emailError) {
            console.error("Failed to send order notification:", emailError);
        }

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error("[CASHFREE_VERIFICATION]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
