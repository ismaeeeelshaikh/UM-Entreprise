"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    return (
        <div className="relative flex min-h-screen flex-col">
            {!isAdmin && <Header />}
            <main className="flex-1">{children}</main>
            {!isAdmin && <Footer />}
        </div>
    );
}
