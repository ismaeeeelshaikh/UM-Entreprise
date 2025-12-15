"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
            return;
        }

        if (status === "authenticated") {
            fetchWishlist();
        }
    }, [status, router]);

    const fetchWishlist = async () => {
        try {
            const response = await fetch("/api/user/wishlist");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container min-h-screen py-10">
                <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
                <div className="flex justify-center items-center h-40">
                    <p>Loading your saved items...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container min-h-screen py-10 px-4 md:px-6">
            <div className="mb-8 flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                <h1 className="text-3xl font-bold">My Wishlist</h1>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
                    <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center">
                        <Heart className="h-10 w-10 text-red-200" />
                    </div>
                    <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Seems like you haven't saved any items yet. Browse our collection and save items you love!
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            images={product.images && product.images.length > 0 ? product.images : (product.variants?.[0]?.images || ["/placeholder.png"])}
                            category={product.category}
                            isCustomizable={product.isCustomizable}
                            variants={product.variants}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
