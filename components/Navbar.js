'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            UM Entreprise
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-primary-600 transition-colors">
              Products
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="hover:text-primary-600 transition-colors">
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative hover:text-primary-600 transition-colors">
              <span className="text-2xl">🛒</span>
            </Link>

            {user ? (
              <>
                <span className="text-gray-700">Hi, {user.name}</span>
                <Link href="/orders" className="hover:text-primary-600 transition-colors">
                  Orders
                </Link>
                <button onClick={logout} className="btn-secondary text-sm py-2 px-4">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/">Home</Link>
              <Link href="/products">Products</Link>
              <Link href="/cart">Cart</Link>
              {user ? (
                <>
                  <Link href="/orders">Orders</Link>
                  {user.role === 'admin' && <Link href="/admin">Admin</Link>}
                  <button onClick={logout} className="text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login">Login</Link>
                  <Link href="/register">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
