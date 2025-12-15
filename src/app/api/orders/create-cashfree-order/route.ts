import { NextResponse } from "next/server";
// Forced update to clear cache
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
        const { amount, customerPhone, couponCode } = body;

        if (!amount) {
            return new NextResponse("Amount is required", { status: 400 });
        }

        const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Cashfree requires return_url to be HTTPS. For localhost, we force https to satisfy the API.
        // User will need to accept the self-signed cert warning or we use a tunnel.
        // But for simply testing the API call success, this is enough.
        const protocol = (process.env.NEXT_PUBLIC_APP_URL?.startsWith("https") || process.env.VERCEL_URL) ? "https" : "https";
        const domain = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL.replace("http://", "").replace("https://", "") : "localhost:3000";
        const returnUrl = `${protocol}://${domain}`;

        const requestData = {
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: session.user.id,
                customer_phone: customerPhone || "9999999999",
                customer_name: session.user.name || "Customer",
                customer_email: session.user.email || "customer@example.com",
            },
            order_meta: {
                return_url: `${returnUrl}/order-success?orderId=${orderId}&couponCode=${couponCode || ""}`,
            },
            order_tags: {
                coupon_code: couponCode || "NONE"
            }
        };

        console.log("[CASHFREE_CONNECT] Connecting to:", CASHFREE_API_URL);
        // console.log("[CASHFREE_REQUEST]", JSON.stringify(requestData, null, 2));

        const response = await fetch(CASHFREE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-client-id": process.env.CASHFREE_APP_ID!,
                "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
                "x-api-version": "2023-08-01",
            },
            body: JSON.stringify(requestData),
        });

        const rawResponse = await response.text();
        console.log("[CASHFREE_RESPONSE_RAW]", rawResponse);

        let data;
        try {
            data = JSON.parse(rawResponse);
        } catch (e) {
            console.error("Failed to parse Cashfree response as JSON");
            throw new Error(`Invalid response from Cashfree: ${rawResponse.substring(0, 100)}`);
        }

        if (!response.ok) {
            console.error("[CASHFREE_ERROR]", data);
            throw new Error(data.message || "Failed to create Cashfree order");
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("[CASHFREE_ORDER_CREATE]", error);
        return new NextResponse(error.message || "Internal Error", { status: 500 });
    }
}
