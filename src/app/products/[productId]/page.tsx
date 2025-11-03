import { notFound } from "next/navigation";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

async function getProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  return product;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>; // ✅ Changed to Promise
}) {
  // ✅ Await params first
  const { productId } = await params;
  const product = await getProduct(productId);

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
                <div className="flex items-center gap-2">
                  <Badge>Customizable</Badge>
                  <span className="text-sm text-muted-foreground">
                    {product.customizationLabel || "Add your personal touch"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Stock:{" "}
              {product.stock > 0
                ? `${product.stock} available`
                : "Out of stock"}
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              disabled={product.stock === 0}
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
