'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = product.images?.[0]?.url || '/images/placeholder.jpg';

  return (
    <Link href={`/products/${product._id}`} className="card-product">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton"></div>
        )}
        
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoadingComplete={() => setImageLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {product.featured && (
            <span className="badge bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
              ⭐ Featured
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="badge bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg ml-auto">
              🔥 Low Stock
            </span>
          )}
        </div>

        {/* Overlay on Hover */}
        <div className="image-overlay"></div>

        {/* Quick View Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold shadow-xl hover:bg-gray-50 transition-colors">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Tag */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
            {product.category}
          </span>
          {product.customizationOptions?.engraving?.available && (
            <span className="text-xs text-gray-500">• Customizable</span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Stock */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-black text-gray-900">
              ₹{product.basePrice.toLocaleString('en-IN')}
            </div>
            {product.customizationOptions?.engraving?.available && (
              <div className="text-xs text-gray-500">
                + customization available
              </div>
            )}
          </div>
          
          {product.stock > 0 ? (
            <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              In Stock
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Sold Out
            </div>
          )}
        </div>

        {/* Rating (Mock) */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <div className="flex text-yellow-400">
            {'★'.repeat(5)}
          </div>
          <span className="text-sm text-gray-600">(4.8)</span>
        </div>
      </div>
    </Link>
  );
}
