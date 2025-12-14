"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { useCart } from "@/store/useCart";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");
    const { clearCart } = useCart();
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderId) return;

        const verifyPayment = async () => {
            const pendingOrderStr = localStorage.getItem("pendingOrder");
            if (!pendingOrderStr) return; // Assume already verified or invalid

            const pendingOrder = JSON.parse(pendingOrderStr);
            if (pendingOrder.orderId !== orderId) return; // Mismatch

            setVerifying(true);
            try {
                const res = await fetch("/api/orders/verify-cashfree-payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        orderId: orderId,
                        items: pendingOrder.items,
                        totalAmount: pendingOrder.totalAmount,
                        shippingAddress: pendingOrder.shippingAddress,
                        saveAddress: pendingOrder.saveAddress
                    })
                });

                if (res.ok) {
                    localStorage.removeItem("pendingOrder");
                    clearCart();
                } else {
                    setError("Payment verification failed. Please contact support.");
                }
            } catch (err) {
                console.error("Verification error", err);
                setError("Something went wrong verifying your order.");
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [orderId, clearCart]);

    if (verifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <h2 className="text-xl font-semibold">Verifying Payment...</h2>
                <p className="text-muted-foreground">Please do not close this window.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="text-red-500 mb-4 text-center">
                    <h2 className="text-xl font-bold mb-2">Order Verification Failed</h2>
                    <p>{error}</p>
                </div>
                <Button onClick={() => router.push("/contact")}>Contact Support</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-xl overflow-hidden bg-white">
                    <div className="bg-green-500 h-2 w-full" />
                    <CardContent className="pt-10 pb-10 px-6 flex flex-col items-center text-center space-y-6">

                        {/* Animated Checkmark Circle */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-2"
                        >
                            <Check className="h-12 w-12 text-green-600 stroke-[3]" />
                        </motion.div>

                        {/* Confirmation Text */}
                        <div className="space-y-2">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl font-bold text-slate-900"
                            >
                                Order Placed Successfully!
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-muted-foreground"
                            >
                                Thank you for your purchase. We've received your order and will begin processing it right away.
                            </motion.p>
                        </div>

                        {/* Order ID Badge */}
                        {orderId && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200"
                            >
                                <p className="text-sm font-medium text-slate-600">
                                    Order ID: <span className="text-slate-900 font-bold">#{orderId.slice(-8)}</span>
                                </p>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="grid grid-cols-1 w-full gap-3 mt-4"
                        >
                            <Button asChild size="lg" className="w-full h-12 text-base">
                                <Link href={orderId ? `/orders/${orderId}` : "/orders"}>
                                    View Order Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full h-12 text-base">
                                <Link href="/products">
                                    <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
                                </Link>
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Support Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-8 text-sm text-muted-foreground"
                >
                    Need help? <Link href="/contact" className="underline hover:text-primary">Contact Support</Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><p>Loading...</p></div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
