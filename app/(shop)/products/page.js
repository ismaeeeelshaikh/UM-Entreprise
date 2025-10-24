import { Suspense } from 'react';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import ProductCard from '@/components/ProductCard';

export const revalidate = 3600;

async function getProducts(searchParams) {
  await connectDB();
  
  const query = { active: true };
  
  if (searchParams.category) {
    query.category = searchParams.category;
  }
  
  if (searchParams.search) {
    query.$text = { $search: searchParams.search };
  }
  
  const products = await Product.find(query).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function ProductsPage({ searchParams }) {
  const products = await getProducts(searchParams);

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
        <p className="text-gray-600">Discover our collection of personalized gifts</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {['all', 'wallet', 'pen', 'keychain', 'ring', 'bangle', 'other'].map((cat) => (
          <a
            key={cat}
            href={cat === 'all' ? '/products' : `/products?category=${cat}`}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              (cat === 'all' && !searchParams.category) || searchParams.category === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </a>
        ))}
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
