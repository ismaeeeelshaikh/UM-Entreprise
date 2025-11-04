import { ProductCardSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      </div>

      <div className="mb-6">
        <div className="h-10 w-[200px] bg-muted animate-pulse rounded" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
