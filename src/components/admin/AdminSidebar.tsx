"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Users, LayoutDashboard, Package, Menu, X, Mail } from "lucide-react";
import { Tag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden border-b p-4 flex items-center justify-between bg-white w-full">
                <h2 className="text-lg font-semibold">Admin Panel</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={cn(
                "bg-muted/40 border-r transition-transform duration-300 ease-in-out z-50",
                "fixed inset-y-0 left-0 w-64 md:relative md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-full max-h-screen flex-col bg-white md:bg-transparent">
                    <div className="hidden md:flex h-16 items-center border-b px-6">
                        <h2 className="text-lg font-semibold">Admin Panel</h2>
                    </div>

                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                            isActive && "bg-muted text-primary"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-auto p-4 border-t">
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/">← Back to Store</Link>
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
