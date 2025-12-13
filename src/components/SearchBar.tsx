"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

function SearchBarContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
        } else {
            router.push("/products");
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-[300px]">
            <div className="relative">
                <Input
                    type="search"
                    placeholder="Search items..."
                    className="pr-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
        </form>
    );
}

export default function SearchBar() {
    return (
        <Suspense fallback={<div className="w-full max-w-[300px] h-10" />}>
            <SearchBarContent />
        </Suspense>
    );
}
