"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/useCart";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  isCustomizable: boolean;
  customizationLabel: string | null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          notFound();
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      customization: product.isCustomizable ? customization : undefined,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="container flex min-h-screen items-center justify-center py-10">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold">
              ₹{product.price.toFixed(2)}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {product.isCustomizable && (
            <Card>
              <CardContent className="p-4">
                <Label htmlFor="customization">
                  {product.customizationLabel || "Add your personal touch"}
                </Label>
                <Input
                  id="customization"
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  placeholder="Enter text for customization"
                  className="mt-2"
                />
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
                min="1"
                max={product.stock}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              ♥
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
