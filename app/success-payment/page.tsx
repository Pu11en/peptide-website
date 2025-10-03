"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
// Adjust path

type OrderDetails = {
  id: string;
  amount_total: number;
  currency: string;
  customer_email: string;
  customer_name: string;
  payment_status: string;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clear } = useCart();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found");
      setLoading(false);
      return;
    }

    async function verifyPayment() {
      try {
        const res = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }

        if (data.success) {
          setOrder(data.session);

          // Clear cart after successful verification
          clear();

          // Clear localStorage order data
          try {
            localStorage.removeItem("lastOrder");
          } catch {}
        } else {
          setError(`Payment status: ${data.status}`);
        }
      } catch (err: any) {
        console.error("Verification error:", err);
        setError(err.message || "Failed to verify payment");
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId, clear]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-red-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mb-6">
            <svg
              className="w-20 h-20 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase, {order?.customer_name}!
          </p>
        </div>

        {order && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm text-gray-900">
                {order.id}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900">{order.customer_email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="text-lg font-bold text-gray-900">
                ${(order.amount_total / 100).toFixed(2)}{" "}
                {order.currency.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {order.payment_status}
              </span>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-700">
            📧 A confirmation email has been sent to{" "}
            <strong>{order?.customer_email}</strong>
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="/"
            className="flex-1 bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
