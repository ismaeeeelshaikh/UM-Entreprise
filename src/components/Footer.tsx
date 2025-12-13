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
          <div className="flex items-center space-x-6">
            <Link
              href="https://www.instagram.com/um_gift_store/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <p className="text-sm text-muted-foreground">Privacy Policy</p>
            <p className="text-sm text-muted-foreground">Terms of Service</p>
          </div>
        </div>
      </div>
    </footer>
  );
}