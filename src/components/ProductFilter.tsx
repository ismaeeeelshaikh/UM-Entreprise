"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProductFilterProps {
    initialCategory?: string;
}

export default function ProductFilter({ initialCategory }: ProductFilterProps) {
    const router = useRouter();

    // We handle navigation on value change
    const handleValueChange = (value: string) => {
        // Construct new URL
        const params = new URLSearchParams(window.location.search);
        if (value === "ALL") {
            params.delete("category");
        } else {
            params.set("category", value);
        }

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="mb-6">
            <Select defaultValue={initialCategory || "ALL"} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Products</SelectItem>
                    <SelectItem value="WALLET">Wallets</SelectItem>
                    <SelectItem value="PEN">Pens</SelectItem>
                    <SelectItem value="KEYCHAIN">Keychains</SelectItem>
                    <SelectItem value="RING">Rings</SelectItem>
                    <SelectItem value="BANGLE">Bangles</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
