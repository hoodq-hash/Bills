"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Home } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import type { Order } from "@/types";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders?orderNumber=${orderNumber}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setOrder);
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-elite-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Order Placed Successfully
        </h1>
        <p className="text-slate-400 mb-8">
          Thank you for your order. We have received your request and will process
          it shortly.
        </p>

        {orderNumber && (
          <div className="bg-elite-surface border border-elite-border rounded-xl p-6 mb-8 text-left">
            <p className="text-xs text-slate-500 uppercase mb-1">Order Number</p>
            <p className="font-mono text-elite-gold text-lg mb-4">{orderNumber}</p>
            {order && (
              <>
                <p className="text-xs text-slate-500 uppercase mb-1">Total</p>
                <p className="text-white text-2xl font-bold mb-4">
                  ${order.total.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 uppercase mb-1">Payment</p>
                <p className="text-slate-300 capitalize mb-4">
                  {order.paymentMethod} — follow payment instructions to complete
                </p>
                <p className="text-sm text-slate-400">
                  A confirmation has been sent to {order.customer.email}
                </p>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary px-8 py-3 text-sm inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/clonedcards"
            className="btn-secondary px-8 py-3 text-sm inline-flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-elite-bg flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-elite-gold" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
