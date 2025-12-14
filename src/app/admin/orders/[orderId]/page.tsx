"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface OrderDetail {
  id: string;
  user: {
    name: string;
    email: string;
  };
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
    selectedColor: string | null; // Add this
    product: {
      name: string;
      description: string;
      images: string[];
    };
  }[];
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
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

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order status updated",
        });
        fetchOrderDetails();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold">Order not found</h1>
        <Button onClick={() => router.push("/admin/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const shippingAddress = JSON.parse(order.shippingAddress);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.id.slice(-8)}</p>
        </div>
        <Button onClick={() => router.push("/admin/orders")} variant="outline">
          Back to Orders
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
                    {item.selectedColor && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Color: {item.selectedColor}
                      </p>
                    )}
                    <p className="mt-2 text-sm">
                      Quantity: {item.quantity} × ₹
                      {item.priceAtPurchase.toFixed(2)}
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

        {/* Order Info */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Update Status</label>
                <Select value={order.status} onValueChange={updateOrderStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  <Badge variant="outline">{order.paymentStatus}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{format(new Date(order.createdAt), "PP")}</span>
                </div>
                {order.paymentId && (
                  <div className="text-xs text-muted-foreground">
                    Payment ID: {order.paymentId}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-muted-foreground">{order.user.email}</p>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
