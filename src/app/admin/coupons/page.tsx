
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Coupon {
    id: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minOrderValue: number;
    expiresAt: string | null;
    isActive: boolean;
}

export default function CouponsPage() {
    const { toast } = useToast();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        minOrderValue: "",
        expiresAt: "",
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await fetch("/api/admin/coupons");
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newCoupon.code || !newCoupon.discountValue) {
            toast({ title: "Please fill required fields", variant: "destructive" });
            return;
        }

        setIsCreating(true);
        try {
            const res = await fetch("/api/admin/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newCoupon,
                    discountValue: parseFloat(newCoupon.discountValue),
                    minOrderValue: parseFloat(newCoupon.minOrderValue) || 0,
                }),
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            const coupon = await res.json();
            setCoupons([coupon, ...coupons]);
            setIsDialogOpen(false);
            setNewCoupon({
                code: "",
                discountType: "PERCENTAGE",
                discountValue: "",
                minOrderValue: "",
                expiresAt: "",
            });
            toast({ title: "Coupon created successfully" });

        } catch (error: any) {
            toast({
                title: "Error creating coupon",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;

        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
            if (res.ok) {
                setCoupons(coupons.filter(c => c.id !== id));
                toast({ title: "Coupon deleted" });
            }
        } catch (error) {
            toast({ title: "Failed to delete coupon", variant: "destructive" });
        }
    };

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage discount codes and promotions</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Coupon
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Coupon</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Coupon Code</label>
                                <Input
                                    placeholder="e.g. WELCOME10"
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <Select
                                        value={newCoupon.discountType}
                                        onValueChange={(val) => setNewCoupon({ ...newCoupon, discountType: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                            <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Value</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 10"
                                        value={newCoupon.discountValue}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Min Order Value (Optional)</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={newCoupon.minOrderValue}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Expires At (Optional)</label>
                                <Input
                                    type="date"
                                    value={newCoupon.expiresAt}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                                />
                            </div>

                            <Button className="w-full" onClick={handleCreate} disabled={isCreating}>
                                {isCreating ? "Creating..." : "Create Coupon"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Min Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No coupons found. Create one to get started!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                coupons.map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell className="font-mono font-medium">
                                            <div className="flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-green-600" />
                                                {coupon.code}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {coupon.discountType === "PERCENTAGE"
                                                ? `${coupon.discountValue}% OFF`
                                                : `₹${coupon.discountValue} OFF`
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue}` : "None"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={coupon.isActive ? "secondary" : "destructive"}>
                                                {coupon.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {coupon.expiresAt ? (
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(coupon.expiresAt), "MMM d, yyyy")}
                                                </div>
                                            ) : "Never"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(coupon.id)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
