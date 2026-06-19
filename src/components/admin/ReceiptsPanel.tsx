"use client";

import { useEffect, useState } from "react";
import { Printer, Download, Search } from "lucide-react";
import type { Order } from "@/types";

function ReceiptContent({ order }: { order: Order }) {
  return (
    <div className="bg-white text-black p-8 max-w-lg mx-auto font-sans text-sm">
      <div className="text-center border-b border-gray-300 pb-4 mb-4">
        <h1 className="text-2xl font-bold tracking-wide">ELITE NOTES</h1>
        <p className="text-gray-500 text-xs mt-1">Official Receipt</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div>
          <p className="text-gray-500">Receipt #</p>
          <p className="font-mono font-bold">{order.receiptNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Date</p>
          <p>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : new Date().toLocaleString()}
          </p>
        </div>
      </div>
      <div className="mb-4 text-xs">
        <p className="text-gray-500">Bill To</p>
        <p className="font-medium">
          {order.customer.firstName} {order.customer.lastName}
        </p>
        <p>{order.customer.email}</p>
        <p>{order.customer.phone}</p>
        <p>
          {order.billing.city}, {order.billing.country} {order.billing.zipCode}
        </p>
      </div>
      <table className="w-full text-xs mb-4">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left py-2">Item</th>
            <th className="text-center py-2">Qty</th>
            <th className="text-right py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="py-2">{item.title}</td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-right py-2">
                ${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs space-y-1 border-t border-gray-300 pt-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping ({order.shippingMethod})</span>
          <span>${order.shippingCost.toFixed(2)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Discount</span>
            <span>-${order.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-2">
          <span>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-300 text-xs text-gray-500">
        <p>Payment: {order.paymentMethod} — {order.paymentStatus}</p>
        <p>Order status: {order.status}</p>
      </div>
      <p className="text-center text-xs text-gray-400 mt-6">
        Thank you for your business — Elite Notes
      </p>
    </div>
  );
}

export default function ReceiptsPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      `${o.customer.firstName} ${o.customer.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handlePrint = (order: Order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
      setPrintOrder(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-elite-gold" />
      </div>
    );
  }

  return (
    <>
      {printOrder && (
        <div className="hidden print:block fixed inset-0 z-[9999] bg-white">
          <ReceiptContent order={printOrder} />
        </div>
      )}

      <div className="space-y-4 pb-20 md:pb-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by order #, name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-elite-surface border border-elite-border text-white rounded-lg text-sm focus:ring-2 focus:ring-elite-gold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="text-slate-400 col-span-full text-center py-16">
              No receipts found
            </p>
          ) : (
            filtered.map((order) => (
              <div
                key={order._id}
                className="bg-elite-surface border border-elite-border rounded-xl p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-elite-gold text-sm">
                      {order.receiptNumber}
                    </p>
                    <p className="text-white font-medium mt-1">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{order.customer.email}</p>
                  </div>
                  <p className="text-lg font-bold text-white">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "—"}{" "}
                  · {order.items.length} item(s) · {order.paymentStatus}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePrint(order)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-elite-gold text-black rounded-lg text-sm font-medium hover:bg-elite-gold-light"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintOrder(order)}
                    className="flex items-center justify-center px-3 py-2 border border-elite-border text-slate-300 rounded-lg hover:border-elite-gold"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {printOrder && (
          <div className="print:hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b bg-elite-surface">
                <p className="text-white font-medium">Receipt Preview</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handlePrint(printOrder)}
                    className="px-4 py-2 bg-elite-gold text-black rounded-lg text-sm"
                  >
                    Print
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintOrder(null)}
                    className="px-4 py-2 border border-elite-border text-slate-300 rounded-lg text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              <ReceiptContent order={printOrder} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
