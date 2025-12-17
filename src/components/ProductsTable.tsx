"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ProductsTableProps {
  products: any[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const onDelete = async (id: string) => {
    try {
      setLoading(id);
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      router.refresh();
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="relative h-16 w-16">
                <Image
                  src={product.images?.[0] || product.variants?.[0]?.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  sizes="64px"
                  className="rounded-md object-cover"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium whitespace-normal break-words min-w-[150px]">{product.name}</TableCell>
            <TableCell className="whitespace-normal">
              <Badge variant="outline" className="whitespace-normal text-center h-auto py-1">{product.category}</Badge>
            </TableCell>
            <TableCell>₹{(product.price > 0 ? product.price : (product.variants?.[0]?.price || 0)).toFixed(2)}</TableCell>
            <TableCell>
              {product.variants?.length > 0
                ? product.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)
                : product.stock}
            </TableCell>
            <TableCell className="space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/products/${product.id}`}>Edit</Link>
              </Button>
              <Button
                onClick={() => onDelete(product.id)}
                disabled={loading === product.id}
                variant="destructive"
                size="sm"
              >
                {loading === product.id ? "Deleting..." : "Delete"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
