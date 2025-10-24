import Link from 'next/link';
import Image from 'next/image';
import connectDB from '@/lib/db';
// 🛑 FINAL FIX: Change to dynamic require() with direct relative path
const Product = require('../lib/models/Product.js');
import ProductCard from '@/components/ProductCard';

export const revalidate = 3600;

async function getFeaturedProducts() {
  try {
    await connectDB();
    const products = await Product.find({ featured: true, active: true })
      .limit(8)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Modern with Gradient */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-pink-600 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-32">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">New Collection 2025</span>
              </div>

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
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>

                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-primary-600 transition-all duration-300"
                >
                  View Collection
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-4xl font-black">50K+</div>
                  <div className="text-sm text-gray-200">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-black">100+</div>
                  <div className="text-sm text-gray-200">Products</div>
                </div>
                <div>
                  <div className="text-4xl font-black">4.9★</div>
                  <div className="text-sm text-gray-200">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:block hidden animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform">
                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform mt-8">
                    <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#f9fafb" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over ₹999' },
              { icon: '✨', title: 'Custom Engraving', desc: 'Personalize your gifts' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% protected' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day guarantee' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <div className="font-semibold text-sm">{feature.title}</div>
                  <div className="text-xs text-gray-500">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Myntra Style */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find the perfect personalized gift</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Wallets', icon: '👛', slug: 'wallet', color: 'from-blue-500 to-blue-600' },
              { name: 'Pens', icon: '🖊️', slug: 'pen', color: 'from-purple-500 to-purple-600' },
              { name: 'Keychains', icon: '🔑', slug: 'keychain', color: 'from-green-500 to-green-600' },
              { name: 'Rings', icon: '💍', slug: 'ring', color: 'from-pink-500 to-pink-600' },
              { name: 'Bangles', icon: '⭕', slug: 'bangle', color: 'from-yellow-500 to-yellow-600' },
              { name: 'Others', icon: '🎁', slug: 'other', color: 'from-red-500 to-red-600' },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${category.color} p-8 text-center text-white aspect-square flex flex-col items-center justify-center`}>
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Amazon Style */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Handpicked just for you</p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group"
            >
              View All
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
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

          <div className="text-center mt-8 md:hidden">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              View All Products
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose UM Entreprise?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We're committed to delivering premium quality personalized gifts that create lasting memories</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '✨',
                title: 'Premium Quality',
                desc: 'Every product is crafted with attention to detail using the finest materials',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '🎨',
                title: 'Unique Customization',
                desc: 'Make it truly yours with our advanced engraving and personalization options',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: '💝',
                title: 'Perfect for Gifting',
                desc: 'Beautiful packaging and presentation that makes every gift extra special',
                gradient: 'from-orange-500 to-red-500'
              },
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10 text-center">
          <h2 className="text-5xl font-black mb-6">Ready to Create Something Special?</h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Start personalizing your perfect gift today and make someone's day unforgettable
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            Start Shopping
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}