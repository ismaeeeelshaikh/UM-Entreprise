import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">UM Entreprise</h3>
            <p className="text-sm">
              Creating unique, personalized gifts that make every moment special.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-white transition-colors">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products?category=wallet" className="hover:text-white transition-colors">
                  Wallets
                </Link>
              </li>
              <li>
                <Link href="/products?category=pen" className="hover:text-white transition-colors">
                  Pens
                </Link>
              </li>
              <li>
                <Link href="/products?category=keychain" className="hover:text-white transition-colors">
                  Keychains
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 info@umentreprise.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Thane, Maharashtra</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} UM Entreprise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
