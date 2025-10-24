'use client';
import { useEffect, useState } from "react";
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/featured-products")
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(Array.isArray(data.products) ? data.products : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-pink-600 text-white overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
            <div>
              <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                Gifts That Tell
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                  Your Story
                </span>
              </h1>
              <p className="text-xl mb-8 text-gray-100 leading-relaxed max-w-lg">
                Create unique, custom-engraved gifts perfect for any occasion. From wallets to couple rings, make every moment unforgettable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Shop Now
                </Link>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary-600 transition-all duration-300"
                >
                  View Collection
                </Link>
              </div>
            </div>
            <div className="relative lg:block hidden animate-float">
              {/* Add your right side Hero image JSX here or keep it empty */}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#f9fafb" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked just for you</p>
            </div>
            <Link href="/products"
              className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
            >
              View All
            </Link>
          </div>
          {loading ? (
            <div>Loading featured products...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No featured products available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
