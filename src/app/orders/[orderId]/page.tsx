"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Check, Truck, Package, MapPin, ShoppingBag } from "lucide-react";

interface OrderDetail {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentId: string;
  shippingAddress: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    customizationText: string | null;
    selectedColor: string | null; // Add this
    product: {
      name: string;
      description: string;
      images: string[];
    };
  }[];
}

const ORDER_STEPS = [
  { label: "Ordered", status: ["PENDING", "PROCESSING"], icon: ShoppingBag },
  { label: "Shipped", status: ["SHIPPED"], icon: Package },
  { label: "Out for delivery", status: ["OUT_FOR_DELIVERY"], icon: Truck },
  { label: "Delivered", status: ["DELIVERED"], icon: MapPin },
] as const;

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    // Defines the hierarchy of statuses
    const statusHierarchy = ["PENDING", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

    // Normalize status to handle the 'Ordered' group
    let currentLevel = statusHierarchy.indexOf(currentStatus);
    if (currentStatus === "PENDING") currentLevel = 1; // Both count as Ordered level for this checks
    if (currentStatus === "PROCESSING") currentLevel = 1;
    if (currentStatus === "CANCELED") return "canceled";

    // Map step index to required hierarchy level
    // 0: Ordered (PENDING/PROCESSING) -> level 1
    // 1: Shipped (SHIPPED) -> level 2
    // 2: Out (OUT_FOR_DELIVERY) -> level 3
    // 3: Delivered (DELIVERED) -> level 4
    const stepLevel = stepIndex + 1;

    if (currentLevel >= stepLevel) return "completed";
    if (currentLevel === stepLevel - 1 && currentStatus !== "DELIVERED") return "current"; // Only if we assume linear progression, but essentially if I am SHIPPED, then Shipped is completed/current? 
    // Actually simplicity:
    // If I am SHIPPED (index 2 in hierarchy), then Ordered (0) is completed. Shipped (1) is current/completed.

    return "upcoming";
  };

  const getCurrentStepIndex = (status: string) => {
    if (status === "DELIVERED") return 3;
    if (status === "OUT_FOR_DELIVERY") return 2;
    if (status === "SHIPPED") return 1;
    return 0; // PENDING or PROCESSING
  };

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-20">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20">
        <h1 className="mb-4 text-3xl font-bold">Order not found</h1>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const shippingAddress = JSON.parse(order.shippingAddress);
  const currentStepIndex = getCurrentStepIndex(order.status);

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.id.slice(-8)}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/orders">Back to Orders</Link>
        </Button>
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
