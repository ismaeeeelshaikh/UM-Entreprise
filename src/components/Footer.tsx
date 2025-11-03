import React from "react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} UM Entreprise. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">Privacy Policy</p>
            <p className="text-sm text-muted-foreground">Terms of Service</p>
          </div>
        </div>
      </div>
    </footer>
  );
}