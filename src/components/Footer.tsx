import React from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UM Entreprise. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center md:justify-end">
            <Link
              href="https://www.instagram.com/um_gift_store/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link>
            <Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}