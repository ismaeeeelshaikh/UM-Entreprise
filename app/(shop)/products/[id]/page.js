import { notFound } from 'next/navigation';
import Image from 'next/image';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import CustomizationForm from '@/components/CustomizationForm';

async function getProduct(id) {
  await connectDB();
  const product = await Product.findById(id).lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

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
            ₹{product.basePrice.toLocaleString('en-IN')}
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
