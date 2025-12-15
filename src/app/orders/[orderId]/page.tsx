"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Check, Truck, Package, MapPin, ShoppingBag, AlertTriangle } from "lucide-react";
// ... imports

// ... existing interfaces

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter(); // Added router
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false); // New state

  // ... useEffect

  // ... fetchOrderDetails logic

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order? refunds for Online payments will be initiated immediately.")) return;

    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELED" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to cancel order");
      }

      alert("Order cancelled successfully");
      fetchOrderDetails(); // Refresh data
    } catch (error: any) {
      alert(error.message);
    } finally {
      setCancelling(false);
    }
  };

  // ... getStepStatus helper

  // ... getCurrentStepIndex helper

  // ... loading and error states

  if (!order) return null; // Logic handled above

  const shippingAddress = JSON.parse(order.shippingAddress);
  const currentStepIndex = getCurrentStepIndex(order.status);
  const isCancellable = ["PENDING", "PROCESSING"].includes(order.status);

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.id.slice(-8)}</p>
        </div>
        <div className="flex gap-2">
          {isCancellable && (
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3"> {/* Full width tracke for mobile friendliness */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative flex flex-col md:flex-row justify-between w-full max-w-4xl mx-auto py-4">
                {/* Progress Bar Background (Desktop) */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 hidden md:block -z-10" />
                {/* Active Progress Bar (Desktop) */}
                <div
                  className="absolute top-5 left-0 h-1 bg-primary hidden md:block -z-10 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
                />

                {ORDER_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.label} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 bg-background md:bg-transparent p-2 md:p-0">
                      <div
                        className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300
                                            ${isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted text-muted-foreground"}
                                        `}
                      >
                        {index < currentStepIndex ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                      </div>
                      <span className={`text-sm font-medium ${isCompleted ? "text-primary" : "text-muted-foreground"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.product.description.slice(0, 50)}...
                    </p>
                    {item.customizationText && (
                      <p className="mt-1 text-sm text-primary">
                        Custom: {item.customizationText}
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Color: {item.selectedColor}
                      </p>
                    )}
                    <p className="mt-2 text-sm">
                      Quantity: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state}
              </p>
              <p>{shippingAddress.pincode}</p>
              <p className="pt-2 text-muted-foreground">
                {shippingAddress.phone}
              </p>
              <p className="text-muted-foreground">{shippingAddress.email}</p>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online'}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
