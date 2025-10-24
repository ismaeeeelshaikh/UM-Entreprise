'use client';

import { useCartStore } from '@/utils/store';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const handleCheckout = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started</p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="card flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.product.images?.[0]?.url || '/images/placeholder.jpg'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                
                {item.customization.engravingText && (
                  <p className="text-sm text-gray-600">
                    Engraving: {item.customization.engravingText}
                  </p>
                )}
                
                {item.customization.color && (
                  <p className="text-sm text-gray-600">Color: {item.customization.color}</p>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-semibold text-primary-600">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  <button
                    onClick={() => removeItem(index)}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary-600">₹{getTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
