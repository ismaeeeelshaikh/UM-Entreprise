import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

async function getProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const product = await getProduct(productId);

  return (
    <div>
      <ProductForm initialData={product} productId={productId} />
    </div>
  );
}
