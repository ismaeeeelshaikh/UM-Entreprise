'use client';

export default function RazorpayButton({ amount, onSuccess }) {
  return (
    <button className="btn-primary w-full">
      Pay ₹{amount.toLocaleString('en-IN')}
    </button>
  );
}
