'use client';
import { useEffect, useState } from "react";

export const dynamic = 'force-dynamic';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-bold mb-8">All Orders</h1>
      {loading ? <p>Loading...</p>
        : orders.length === 0
        ? <p>No orders found.</p>
        : <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="card shadow border p-6">
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-xs text-gray-500">Order ID: {order._id}</span>
                  <span className={
                    order.status === 'cancelled'
                      ? 'text-red-600'
                      : order.status === 'delivered'
                      ? 'text-green-600'
                      : 'text-blue-600'
                  }>{order.status}</span>
                </div>
                <div className="mb-1"><b>Amount:</b> ₹{order.amount}</div>
                <div className="mb-1 text-sm"><b>User ID:</b> {order.user}</div>
                <div className="mb-1 text-sm"><b>Address:</b> {order.address}</div>
                <div className="mb-2 font-semibold">Items:</div>
                <ul>
                  {(order.items || []).map((item, idx) => (
                    <li key={idx} className="mb-1">
                      {item.image && (
                        <img src={item.image} alt={item.name} width={40} height={40}
                          style={{
                            display: 'inline-block',
                            marginRight: 8,
                            borderRadius: 4,
                            verticalAlign: 'middle'
                          }}
                        />
                      )}
                      <b>{item.name}</b> (x{item.quantity}) - ₹{item.price}
                    </li>
                  ))}
                </ul>
                {order.cancelReason && (
                  <div className="text-xs text-red-500">Cancel Reason: {order.cancelReason}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Placed: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
