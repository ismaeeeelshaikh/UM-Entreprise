import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="mb-4 text-muted-foreground">
        {icon || <PackageOpen className="h-16 w-16" />}
      </div>
      <h3 className="mb-2 text-2xl font-bold">{title}</h3>
      <p className="mb-6 max-w-md text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild size="lg">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
