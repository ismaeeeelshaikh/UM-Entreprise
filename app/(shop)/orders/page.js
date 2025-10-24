'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Image from 'next/image';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    const res = await fetch('/api/orders?user=' + user.id);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [user]);

  const handleCancel = async (orderId) => {
  if (!user) return;
  let reason = '';
  const options = [
    'Ordered by mistake',
    'Found at lower price elsewhere',
    'Too late delivery',
    'Changed my mind',
    'Others (type your reason)'
  ];
  const list = options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
  let select = prompt(
    "Please select a reason for cancellation:\n" + list + "\n\nType the number or your custom reason."
  );
  if (!select) return;
  const num = parseInt(select);
  if (!isNaN(num) && num >= 1 && num <= options.length) {
    reason = options[num - 1];
  } else {
    reason = select;
  }
  if (!reason) return;
  setCancelling(orderId);

  const patchRes = await fetch('/api/orders', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, userId: user.id, reason }),
  });
  setCancelling(null);

  // FIX: Safely parse only if there's a body
  let respData = null;
  try {
    const text = await patchRes.text();
    respData = text ? JSON.parse(text) : {};
  } catch (e) {
    respData = {};
  }

  if (patchRes.ok && respData && respData.order) {
    await fetchOrders();
  } else {
    alert('Could not cancel order. Response: ' + JSON.stringify(respData));
  }
};



  if (!user) {
    return (
      <div className="container-custom py-12">
        <h1 className="text-4xl font-bold mb-8">Your Orders</h1>
        <p className="text-gray-600">Please login to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">Your Orders</h1>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card shadow-lg border relative p-6">
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'cancelled'
                  ? 'bg-gray-200 text-gray-600'
                  : order.status === 'cod'
                    ? 'bg-red-100 text-red-800'
                    : order.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                  {order.status}
                </span>
              </div>
              <div className="mb-2 text-gray-700">
                <span className="text-sm text-gray-400">Order ID:</span>
                <span className="font-mono ml-2">{order._id.slice(-6)}</span>
              </div>
              <div className="mb-2 font-semibold">
                Payment ID: <span className="font-mono">{order.paymentId || <span className="italic">N/A</span>}</span>
              </div>
              <div className="mb-2 font-semibold">
                Amount: <span className="font-normal">₹{order.amount}</span>
              </div>
              <div className="mb-2 font-semibold">
                Address: <span className="font-normal">{order.address}</span>
              </div>
              <div className="mb-2 font-semibold">Items:</div>
              <div className="flex flex-col gap-2 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-md p-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-200">
                      <Image
                        src={item.image && item.image !== '' ? item.image : '/images/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        priority={false}
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity}  |  Price: ₹{item.price}
                        {item.customization?.engravingText && (
                          <span> | Engraving: {item.customization.engravingText}</span>
                        )}
                        {item.customization?.color && item.customization.color !== '' && (
                          <span> | Color: {item.customization.color}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </div>
              {(order.status !== 'cancelled' && order.status !== 'delivered') && (
                <button
                  onClick={() => handleCancel(order._id)}
                  className="btn-outline mt-3"
                  disabled={cancelling === order._id}
                >
                  {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
              {order.status === 'cancelled' && (
                <div className="text-sm mt-2 text-red-400">
                  Cancelled{order.cancelReason && <>: {order.cancelReason}</>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
