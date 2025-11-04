"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/useCart";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY"); // ✅ NEW

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const handlePayment = async (values: CheckoutFormValues) => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/checkout");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Handle Cash on Delivery
      if (paymentMethod === "COD") {
        const response = await fetch("/api/orders/create-cod-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items,
            totalAmount: getTotalPrice(),
            shippingAddress: values,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          clearCart();
          toast({
            title: "Order placed successfully! 🎉",
            description: "You'll pay when your order is delivered",
          });
          router.push(`/orders/${data.orderId}`);
        } else {
          throw new Error("Failed to place COD order");
        }
        return;
      }

      // ✅ Handle Razorpay Payment
      const orderResponse = await fetch("/api/orders/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getTotalPrice(),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Order creation error:", errorData);
        throw new Error(errorData.details || "Failed to create order");
      }

      const { orderId, amount, currency } = await orderResponse.json();

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay script not loaded");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: amount,
        currency: currency,
        name: "UM Entreprise",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/orders/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                items: items,
                totalAmount: getTotalPrice(),
                shippingAddress: values,
              }),
            });

            if (verifyResponse.ok) {
              const data = await verifyResponse.json();
              clearCart();
              toast({
                title: "Payment successful! 🎉",
                description: "Your order has been placed",
              });
              router.push(`/orders/${data.orderId}`);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment handler error:", error);
            toast({
              title: "Payment Error",
              description: "Failed to verify payment. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: values.fullName,
          email: values.email,
          contact: values.phone,
        },
        theme: {
          color: "#21808D",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment",
              variant: "destructive",
            });
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20">
        <h1 className="mb-4 text-3xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-muted-foreground">
          Add some products to checkout
        </p>
        <Button onClick={() => router.push("/products")} size="lg">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Street address, apartment, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Mumbai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Maharashtra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pincode</FormLabel>
                          <FormControl>
                            <Input placeholder="400001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ✅ Payment Method Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-accent transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="RAZORPAY"
                          checked={paymentMethod === "RAZORPAY"}
                          onChange={(e) => setPaymentMethod(e.target.value as "RAZORPAY")}
                          className="h-4 w-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Online Payment (Razorpay)</p>
                          <p className="text-sm text-muted-foreground">
                            Pay securely with Card, UPI, Net Banking
                          </p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-accent transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={(e) => setPaymentMethod(e.target.value as "COD")}
                          className="h-4 w-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">
                            Pay when you receive your order
                          </p>
                        </div>
                      </label>
                    </CardContent>
                  </Card>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading
                      ? "Processing..."
                      : paymentMethod === "COD"
                      ? "Place Order (COD)"
                      : "Proceed to Payment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
