
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
    couponCode?: string;
    discountValue?: number;
    discountType?: "PERCENTAGE" | "FIXED";
}

export default function AnnouncementBar({ couponCode, discountValue, discountType }: AnnouncementBarProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible || !couponCode) return null;

    return (
        <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium relative transition-all duration-300">
            <div className="container flex items-center justify-center text-center pr-8">
                <p>
                    🎉 Special Offer! Use code <span className="font-bold underline">{couponCode}</span> for {" "}
                    {discountType === "PERCENTAGE" ? `${discountValue}% OFF` : `₹${discountValue} OFF`}
                    {" "}your first order!
                </p>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
                aria-label="Close announcement"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
