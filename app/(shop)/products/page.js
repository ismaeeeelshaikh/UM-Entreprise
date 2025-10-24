'use client';
import { useEffect, useState } from "react";
import ProductCard from '@/components/ProductCard';

export default function ProductsPage({ searchParams }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = "/api/products";
    const params = [];
    if (searchParams?.category) params.push("category=" + searchParams.category);
    if (searchParams?.search) params.push("search=" + searchParams.search);
    if (params.length) url += "?" + params.join("&");
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data.products) ? data.products : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="container-custom py-12">
      {/* ... your top categories code */}
      {loading ? (
        <div>Loading...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
}
