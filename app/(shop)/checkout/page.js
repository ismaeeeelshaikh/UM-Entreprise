'use client';

import { useState } from 'react';
import { useCartStore } from '@/utils/store';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  // Clean items for order (now with image, name, all details)
  const cleanItems = items.map(item => ({
    productId: item.product?._id,
    name: item.product?.name,
    image: item.product?.images?.[0]?.url || '/images/placeholder.jpg',
    quantity: item.quantity,
    price: item.price,
    customization: item.customization,
  }));

  // Razorpay Payment Handler
  const handlePayment = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!address) {
      alert('Please enter address');
      return;
    }
    setProcessing(true);

    const orderRes = await fetch('/api/payment/razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: getTotal() })
    });
    const { orderId, amount, currency, error } = await orderRes.json();
    if (error) {
      alert('Payment initiation failed: ' + error);
      setProcessing(false);
      return;
    }

    // Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'UM Entreprise',
        description: 'Order Payment',
        order_id: orderId,
        handler: async function (response) {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId,
              user: user.id,
              items: cleanItems,
              address,
              amount: getTotal(),
              status: 'paid'
            })
          });
          clearCart();
          router.push('/orders');
        },
        prefill: { name: user.name, email: user.email },
        notes: { address: address },
        theme: { color: '#dc2626' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      setProcessing(false);
    };
    document.body.appendChild(script);
  };

  // Cash on Delivery Handler
  const handleCOD = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!address) {
      alert('Please enter address');
      return;
    }
    setProcessing(true);
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: null,
        orderId: null,
        user: user.id,
        items: cleanItems,
        address,
        amount: getTotal(),
        status: 'cod'
      })
    });
    clearCart();
    setProcessing(false);
    router.push('/orders');
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      {user ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
            <input
              className="input-field"
              type="text"
              placeholder="Enter your full address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <ul className="mb-4">
              {items.map((item, idx) => (
                <li key={idx} className="mb-2">
                  {item.product.name} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </li>
              ))}
            </ul>
            <div className="text-xl font-bold">
              Total: ₹{getTotal().toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="btn-primary w-full mb-4"
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Pay with Razorpay'}
          </button>
          <button
            onClick={handleCOD}
            className="btn-outline w-full"
            disabled={processing}
          >
            {processing ? 'Placing Order...' : 'Cash on Delivery'}
          </button>
        </>
      ) : (
        <div>
          <p className="mb-4">You must be logged in to checkout.</p>
          <button className="btn-primary" onClick={() => router.push('/login')}>
            Login
          </button>
        </div>
      )}
    </div>
  );
}
