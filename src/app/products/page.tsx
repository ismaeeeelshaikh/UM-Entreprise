import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prisma } from "@prisma/client";

async function getProducts(category?: string, search?: string) {
  const whereClause: Prisma.ProductWhereInput = {};

  if (category && category !== "ALL") {
    whereClause.category = category as any;
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      variants: true,
    },
  });

  return products;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  // ✅ Await searchParams first
  const { category, search } = await searchParams;
  const products = await getProducts(category, search);

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Discover our collection of personalized gifts
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <Select defaultValue={category || "ALL"}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
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

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              No products found. Check back soon!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              images={product.images && product.images.length > 0 ? product.images : (product.variants?.[0]?.images || [])}
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
