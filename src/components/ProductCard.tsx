"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import WishlistButton from "@/components/WishlistButton";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  isCustomizable: boolean;
  variants?: any[]; // Allow variants to be passed for fallback logic
  reviews?: { rating: number }[]; // Array of reviews to calculate average
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  images,
  category,
  isCustomizable,
  variants,
  reviews,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={images[0] || "/placeholder.png"}
          alt={name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        {isCustomizable && (
          <Badge className="absolute right-2 top-2" variant="secondary">
            Customizable
          </Badge>
        )}
        <WishlistButton productId={id} className="absolute top-2 right-2" />
      </div>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2">
          {category}
        </Badge>
        <h3 className="font-semibold line-clamp-2 min-h-[3rem]">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Rating Display */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">
            {reviews && reviews.length > 0
              ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
              : "New"
            }
          </span>
          {reviews && reviews.length > 0 && (
            <span className="text-xs text-muted-foreground">({reviews.length})</span>
          )}
        </div>

        <p className="mt-2 text-lg font-bold">₹{(price > 0 ? price : (variants?.[0]?.price || 0)).toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
