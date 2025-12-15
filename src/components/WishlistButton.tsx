"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
    productId: string;
    className?: string; // Allow positioning
}

export default function WishlistButton({ productId, className }: WishlistButtonProps) {
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            checkWishlistStatus();
        } else {
            setLoading(false);
        }
    }, [session, productId]);

    const checkWishlistStatus = async () => {
        try {
            const response = await fetch(`/api/user/wishlist/check?productId=${productId}`);
            const data = await response.json();
            setIsWishlisted(data.isWishlisted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent linking to product page if button is on a card
        e.stopPropagation();

        if (!session) {
            toast({
                title: "Please sign in",
                description: "You need to be signed in to save items.",
                variant: "destructive",
            });
            router.push("/auth/signin");
            return;
        }

        // Optimistic UI update
        const previousState = isWishlisted;
        setIsWishlisted(!previousState);

        try {
            const response = await fetch("/api/user/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) throw new Error("Failed");

            const data = await response.json();

            toast({
                title: data.isWishlisted ? "Added to Wishlist" : "Removed from Wishlist",
                description: data.isWishlisted
                    ? "This item has been saved for later."
                    : "This item has been removed from your list.",
            });

            setIsWishlisted(data.isWishlisted);

        } catch (error) {
            // Revert on error
            setIsWishlisted(previousState);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return <div className="h-9 w-9" />; // Placeholder size
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm z-10 transition-all", className)}
            onClick={toggleWishlist}
        >
            <Heart
                className={cn("h-5 w-5 transition-colors",
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
            />
            <span className="sr-only">Add to wishlist</span>
        </Button>
    );
}
