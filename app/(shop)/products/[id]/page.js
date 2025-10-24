'use client';   // 👈 If you want strict client, else SSR me fetch ka use!
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CustomizationForm from '@/components/CustomizationForm';

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
        if (!data.product) {
          router.replace('/404');
        }
      })
      .catch(() => setLoading(false));
  }, [params.id, router]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const imageUrl = product.images?.[0]?.url || '/images/placeholder.jpg';

  return (
    <div className="container-custom py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary-600 mb-6">
            ₹{product.basePrice?.toLocaleString('en-IN') || product.price}
          </p>
          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          {/* Customization Form */}
          <CustomizationForm product={product} />
        </div>
      </div>
    </div>
  );
}
