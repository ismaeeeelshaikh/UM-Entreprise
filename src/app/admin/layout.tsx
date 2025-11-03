import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect if not admin
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <nav className="space-y-2 p-4">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/products">Products</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/admin/orders">Orders</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/">← Back to Store</Link>
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
