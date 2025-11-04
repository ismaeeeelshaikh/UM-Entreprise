"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";

export default function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCart((state) => state.getTotalItems());

  // ✅ Only render after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Return static version during SSR
  if (!mounted) {
    return (
      <Button asChild variant="ghost" size="icon" className="relative">
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  // ✅ Return dynamic version after mount
  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}
