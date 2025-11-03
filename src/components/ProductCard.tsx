"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  isCustomizable: boolean;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  images,
  category,
  isCustomizable,
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
      </div>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2">
          {category}
        </Badge>
        <h3 className="font-semibold line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <p className="mt-2 text-lg font-bold">₹{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
