'use client';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data.products) ? data.products : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(prod => (
            <div key={prod._id} className="card shadow border p-4">
              {prod.images && prod.images[0]?.url && (
                <img
                  src={prod.images[0].url}
                  alt={prod.name}
                  width={80}
                  height={80}
                  className="mb-2 rounded"
                  style={{ objectFit: 'cover' }}
                />
              )}
              <div className="font-semibold text-lg">{prod.name}</div>
              <div className="text-sm text-gray-600">₹{prod.price}</div>
              <div className="text-xs text-gray-400">{prod._id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
