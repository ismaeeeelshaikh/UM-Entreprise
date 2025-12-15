import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        <div className="container py-6 px-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}
