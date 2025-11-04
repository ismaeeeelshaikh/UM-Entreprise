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

interface OrderDetail {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentId: string;
  shippingAddress: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    customizationText: string | null;
    product: {
      name: string;
      description: string;
      images: string[];
    };
  }[];
}

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
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge>{order.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <Badge variant="outline">{order.paymentStatus}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Date</span>
                <span>{format(new Date(order.createdAt), "PP")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
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
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
              {order.paymentId && (
                <p className="pt-2 text-xs text-muted-foreground">
                  Payment ID: {order.paymentId}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
