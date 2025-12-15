"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/store/useCart";
import { useToast } from "@/components/ui/use-toast";
import { Plus, MapPin, Pencil, Trash2, CheckCircle2, Truck } from "lucide-react";
import { addDays, format } from "date-fns";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
];

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Japan", "China", "Brazil", "South Africa",
  "United Arab Emirates", "Singapore", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain"
];

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  country: z.string().min(2, "Country is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Region is required"),
  pincode: z.string().min(3, "Zip/Pincode must be at least 3 characters"),
  saveAddress: z.boolean().default(false).optional(),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

interface Address {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");

  // Address Management State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      country: "India",
      address: "",
      city: "",
      state: "",
      pincode: "",
      saveAddress: false,
    },
  });

  const selectedCountry = form.watch("country");
  const pincode = form.watch("pincode");

  // Fetch Addresses on Load
  useEffect(() => {
    if (session?.user) {
      fetchAddresses();
    }
  }, [session]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data);
        // Auto-select default
        const defaultAddr = data.find((a: Address) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          populateForm(defaultAddr);
        } else if (data.length > 0) {
          // Select first if no default
          setSelectedAddressId(data[0].id);
          populateForm(data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };

  const populateForm = (addr: Address) => {
    form.setValue("fullName", addr.fullName);
    form.setValue("email", addr.email || session?.user?.email || "");
    form.setValue("phone", addr.phone);
    form.setValue("country", addr.country);
    form.setValue("address", addr.address);
    form.setValue("city", addr.city);
    form.setValue("state", addr.state);
    form.setValue("pincode", addr.pincode);
  };

  const handleAddressSelect = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setIsAddingNew(false);
    setIsEditingId(null);
    populateForm(addr);
  };

  const handleAddNew = () => {
    setSelectedAddressId(null);
    setIsAddingNew(true);
    setIsEditingId(null);
    form.reset({
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      country: "India",
      address: "",
      city: "",
      state: "",
      pincode: "",
      saveAddress: true, // Default to true when adding new
    });
  };

  const handleEdit = (addr: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingId(addr.id);
    setIsAddingNew(false);
    setSelectedAddressId(addr.id); // Also select it
    populateForm(addr);
    form.setValue("saveAddress", addr.isDefault); // Reflect default status
  };

  // Auto-fetch City/State based on Pincode (India only)
  useEffect(() => {
    if ((isAddingNew || isEditingId) && selectedCountry === "India" && pincode?.length === 6) {
      const fetchPincodeDetails = async () => {
        setIsFetchingPincode(true);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await response.json();

          if (data && data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            form.setValue("city", details.District);
            form.setValue("state", details.State);
            toast({
              title: "Address Found!",
              description: `${details.District}, ${details.State}`,
            });
          }
        } catch (error) {
          console.error("Failed to fetch pincode details", error);
        } finally {
          setIsFetchingPincode(false);
        }
      };

      const timeoutId = setTimeout(fetchPincodeDetails, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [pincode, selectedCountry, form, toast, isAddingNew, isEditingId]);

  const onFormSubmit = async (values: CheckoutFormValues) => {
    // If adding new or editing, save/update address first via API
    if (isAddingNew || isEditingId) {
      // API Call to save address
      try {
        const url = isEditingId ? `/api/user/addresses/${isEditingId}` : "/api/user/addresses";
        const method = isEditingId ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, isDefault: values.saveAddress }),
        });

        if (!res.ok) throw new Error("Failed to save address");

        // Refresh addresses
        await fetchAddresses();
        setIsAddingNew(false);
        setIsEditingId(null);

        // Continue to payment with these values
        handlePayment(values);
      } catch (error) {
        toast({
          title: "Error saving address",
          description: "Could not save your address details. Please try again.",
          variant: "destructive"
        });
        return; // Stop here if save failed
      }
    } else {
      // Just using existing selected address
      handlePayment(values);
    }
  };

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
        if (values.country !== "India") {
          throw new Error("Cash on Delivery is available only in India");
        }

        const response = await fetch("/api/orders/create-cod-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items,
            totalAmount: getTotalPrice(),
            shippingAddress: values,
            saveAddress: values.saveAddress, // Legacy support, though handled by address API now
          }),
        });

        if (response.ok) {
          const data = await response.json();
          clearCart();
          toast({
            title: "Order placed successfully! 🎉",
            description: "You'll pay when your order is delivered",
          });
          router.push(`/order-success?orderId=${data.orderId}`);
        } else {
          throw new Error("Failed to place COD order");
        }
        return;
      }

      // ✅ Handle Cashfree Payment
      if (typeof window === "undefined") return;

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({
        mode: "production",
      });

      const orderResponse = await fetch("/api/orders/create-cashfree-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getTotalPrice(),
          customerPhone: values.phone,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const { payment_session_id, order_id } = await orderResponse.json();

      // Save pending order details for verification on return
      localStorage.setItem("pendingOrder", JSON.stringify({
        items,
        totalAmount: getTotalPrice(),
        shippingAddress: values,
        saveAddress: values.saveAddress,
        orderId: order_id
      }));

      const checkoutOptions = {
        paymentSessionId: payment_session_id,
        redirectTarget: "_self" as const,
        returnUrl: `${window.location.origin}/order-success?orderId=${order_id}`,
      };

      await cashfree.checkout(checkoutOptions);

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
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 px-4 md:px-6">
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
    <div className="container py-10 px-4 md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Shipping Information Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Saved Addresses List */}
          {!isAddingNew && !isEditingId && savedAddresses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Deliver Address</CardTitle>
                <CardDescription>Choose where you want your items delivered</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`relative flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all hover:bg-accent/50 ${selectedAddressId === addr.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'}`}
                    onClick={() => handleAddressSelect(addr)}
                  >
                    <div className="mt-1">
                      <div className={`h-4 w-4 rounded-full border border-primary ${selectedAddressId === addr.id ? 'bg-primary' : 'bg-transparent'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{addr.fullName}</span>
                        {addr.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm text-muted-foreground">{addr.country}</p>
                      <p className="text-sm text-muted-foreground mt-1">Phone: {addr.phone}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-8 w-8 p-0"
                      onClick={(e) => handleEdit(addr, e)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-2" onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Address Form (Show if Adding New, Editing, or No Addresses) */}
          {(isAddingNew || isEditingId || savedAddresses.length === 0) && (
            <Card>
              <CardHeader>
                <CardTitle>{isEditingId ? "Edit Address" : "Add New Address"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form id="address-form" onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                form.setValue("state", "");
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip/Pincode</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input disabled={isFetchingPincode} {...field} />
                                {isFetchingPincode && (
                                  <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                            <FormLabel>State/Region</FormLabel>
                            {selectedCountry === "India" ? (
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {indianStates.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="saveAddress"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Make this my default address</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Save this address for later
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {savedAddresses.length > 0 && (
                      <Button type="button" variant="ghost" onClick={() => {
                        setIsAddingNew(false);
                        setIsEditingId(null);
                        // Re-select first available or last selected
                        fetchAddresses();
                      }}>
                        Cancel
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-accent transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={(e) => setPaymentMethod(e.target.value as "ONLINE")}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <p className="font-medium">Online Payment (Cards, UPI, NetBanking)</p>
                  <p className="text-sm text-muted-foreground">
                    Pay securely via Cashfree
                  </p>
                </div>
              </label>

              <label className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${selectedCountry !== "India" ? "opacity-50 cursor-not-allowed bg-muted" : "cursor-pointer hover:bg-accent"}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value as "COD")}
                  disabled={selectedCountry !== "India"}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCountry === "India" ? "Pay when you receive your order" : "Available only in India"}
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Main Action Button */}
          {/* Delivery Estimate Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3 text-blue-800 mb-6">
            <Truck className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-semibold text-sm">
                Estimated Delivery: {paymentMethod === "COD" ? "7-10 Days" : "4-5 Days"}
              </p>
              <p className="text-xs text-blue-600">
                {paymentMethod === "COD"
                  ? `${format(addDays(new Date(), 7), "MMM d")} - ${format(addDays(new Date(), 10), "MMM d")}`
                  : `${format(addDays(new Date(), 4), "MMM d")} - ${format(addDays(new Date(), 5), "MMM d")}`
                }
              </p>
            </div>
          </div>

          {(!isAddingNew && !isEditingId && savedAddresses.length > 0) ? (
            <Button
              onClick={form.handleSubmit(onFormSubmit)}
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : paymentMethod === "COD" ? "Place Order (COD)" : "Proceed to Payment"}
            </Button>
          ) : (
            <Button
              onClick={form.handleSubmit(onFormSubmit)}
              type="submit"
              form="address-form"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isAddingNew || isEditingId ? "Save & Proceed" : (isLoading ? "Processing..." : "Proceed to Payment")}
            </Button>
          )}

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
