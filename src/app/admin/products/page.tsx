import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import ProductsTable from "@/components/ProductsTable";

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      variants: true,
    },
  });
  return products;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
