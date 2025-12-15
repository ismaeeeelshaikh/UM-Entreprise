"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    isCustomizable: boolean;
    variants: any[];
    reviews: { rating: number }[];
}

interface SimilarProductsProps {
    currentProductId: string;
    category: string;
}

export default function SimilarProducts({ currentProductId, category }: SimilarProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                // Fetch all products in the category
                const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
                if (!res.ok) throw new Error("Failed to fetch");

                const data: Product[] = await res.json();

                // Filter out the current product and limit to 4-5 items
                const filtered = data
                    .filter((p) => p.id !== currentProductId)
                    .slice(0, 5);

                setProducts(filtered);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        if (category) {
            fetchProducts();
        } else {
            setLoading(false);
        }
    }, [category, currentProductId]);

    if (loading) return null;

    if (products.length === 0) return null;

    return (
        <section className="mt-16 space-y-6">
            <h2 className="text-2xl font-bold">You might also love</h2>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex w-max space-x-4 pb-4">
                    {products.map((product) => (
                        <div key={product.id} className="w-[280px]">
                            <ProductCard
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                images={product.images && product.images.length > 0 ? product.images : (product.variants?.[0]?.images || [])}
                                category={product.category}
                                isCustomizable={product.isCustomizable}
                                variants={product.variants}
                                reviews={product.reviews}
                            />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
    );
}
