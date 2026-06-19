"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_OPTIONS: PaymentStatus[] = ["pending", "paid", "failed"];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    paid: "bg-green-500/20 text-green-400",
    processing: "bg-blue-500/20 text-blue-400",
    shipped: "bg-purple-500/20 text-purple-400",
    delivered: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-red-500/20 text-red-400",
    failed: "bg-red-500/20 text-red-400",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
        colors[status] || "bg-slate-500/20 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) setOrders(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (
    id: string,
    updates: { status?: OrderStatus; paymentStatus?: PaymentStatus }
  ) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
      if (selected?._id === id) setSelected(updated);
      toast.success("Order updated");
    } else {
      toast.error("Failed to update order");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order permanently?")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success("Order deleted");
    }
  };

  const filtered = orders.filter((o) =>
    filter === "all" ? true : o.status === filter
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-elite-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-elite-surface border border-elite-border text-white px-4 py-2 rounded-lg text-sm"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-elite-surface border border-elite-border text-slate-300 rounded-lg hover:border-elite-gold text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-elite-surface border border-elite-border rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-slate-400 text-center py-16">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-elite-bg/50 text-slate-400">
                  <tr>
                    <th className="text-left px-4 py-3">Order</th>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-left px-4 py-3">Total</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Payment</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order._id}
                      className={`border-t border-elite-border cursor-pointer hover:bg-elite-bg/30 ${
                        selected?._id === order._id ? "bg-elite-bg/50" : ""
                      }`}
                      onClick={() => setSelected(order)}
                    >
                      <td className="px-4 py-3 font-mono text-elite-gold text-xs">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <div>{order.customer.firstName} {order.customer.lastName}</div>
                        <div className="text-xs text-slate-500">{order.customer.email}</div>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(order);
                          }}
                          className="p-1.5 hover:bg-elite-card rounded"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-elite-surface border border-elite-border rounded-xl p-5">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase">Order</p>
                <p className="font-mono text-elite-gold">{selected.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase mb-1">Customer</p>
                <p className="text-white">
                  {selected.customer.firstName} {selected.customer.lastName}
                </p>
                <p className="text-sm text-slate-400">{selected.customer.email}</p>
                <p className="text-sm text-slate-400">{selected.customer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase mb-2">Items</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  {selected.items.map((item, i) => (
                    <li key={i} className="flex justify-between border-b border-elite-border pb-2">
                      <span className="line-clamp-1">{item.title}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${selected.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${selected.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-elite-border">
                  <span>Total</span>
                  <span className="text-elite-gold">${selected.total.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase">Order Status</label>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    updateOrder(selected._id, {
                      status: e.target.value as OrderStatus,
                    })
                  }
                  className="w-full mt-1 bg-elite-bg border border-elite-border text-white px-3 py-2 rounded-lg text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase">Payment Status</label>
                <select
                  value={selected.paymentStatus}
                  onChange={(e) =>
                    updateOrder(selected._id, {
                      paymentStatus: e.target.value as PaymentStatus,
                    })
                  }
                  className="w-full mt-1 bg-elite-bg border border-elite-border text-white px-3 py-2 rounded-lg text-sm"
                >
                  {PAYMENT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500">
                Payment: {selected.paymentMethod} · Shipping: {selected.shippingMethod}
              </p>
              {selected.notes && (
                <p className="text-sm text-slate-400 italic">Note: {selected.notes}</p>
              )}
              <button
                type="button"
                onClick={() => deleteOrder(selected._id)}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete order
              </button>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-12">
              Select an order to view details
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
