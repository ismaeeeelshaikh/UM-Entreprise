"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
      name: string;
      images: string[];
    };
  }[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/orders");
      return;
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders/user");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-20">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20">
        <h1 className="mb-4 text-3xl font-bold">No orders yet</h1>
        <p className="mb-8 text-muted-foreground">
          Start shopping to see your orders here
        </p>
        <Button asChild size="lg">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500",
      PROCESSING: "bg-blue-500",
      SHIPPED: "bg-purple-500",
      DELIVERED: "bg-green-500",
      CANCELED: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Placed on {format(new Date(order.createdAt), "PPP")}
                </p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ₹{item.priceAtPurchase.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between border-t pt-4">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-lg font-bold">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${order.id}`}>View Details</Link>
                  </Button>
                  <Badge variant="outline" className="ml-auto">
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
