"use client";

import { useEffect, useState } from "react";
import { Eye, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderStatus, PaymentStatus } from "@/types";
import { AdminLoading, AdminEmpty, StatusBadge } from "./AdminUI";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_OPTIONS: PaymentStatus[] = ["pending", "paid", "failed"];

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

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="admin-select w-auto min-w-[160px]"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="button" onClick={fetchOrders} className="btn-ghost-gold gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 admin-card overflow-hidden">
          {filtered.length === 0 ? (
            <AdminEmpty message="No orders found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order._id}
                      className={`cursor-pointer ${
                        selected?._id === order._id ? "bg-elite-gold/[0.04]" : ""
                      }`}
                      onClick={() => setSelected(order)}
                    >
                      <td className="font-mono text-elite-gold text-xs">
                        {order.orderNumber}
                      </td>
                      <td>
                        <div className="text-white/90">
                          {order.customer.firstName} {order.customer.lastName}
                        </div>
                        <div className="text-xs text-elite-muted mt-0.5">
                          {order.customer.email}
                        </div>
                      </td>
                      <td className="text-white font-medium">
                        ${order.total.toFixed(2)}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        <StatusBadge status={order.paymentStatus} />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(order);
                          }}
                          className="p-1.5 text-elite-muted hover:text-elite-gold transition-colors"
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-card p-6">
          {selected ? (
            <div className="space-y-5">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted mb-1">
                  Order
                </p>
                <p className="font-mono text-elite-gold">{selected.orderNumber}</p>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted mb-2">
                  Customer
                </p>
                <p className="font-display font-light italic text-lg text-white">
                  {selected.customer.firstName} {selected.customer.lastName}
                </p>
                <p className="text-sm text-elite-muted mt-1">{selected.customer.email}</p>
                <p className="text-sm text-elite-muted">{selected.customer.phone}</p>
              </div>

              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted mb-2">
                  Items
                </p>
                <ul className="space-y-2 text-sm">
                  {selected.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex justify-between gap-3 border-b border-white/5 pb-2 text-white/80"
                    >
                      <span className="line-clamp-1">{item.title}</span>
                      <span className="text-elite-gold shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-sm space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-elite-muted">
                  <span>Subtotal</span>
                  <span>${selected.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-elite-muted">
                  <span>Shipping</span>
                  <span>${selected.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-medium pt-2">
                  <span>Total</span>
                  <span className="font-display font-light italic text-xl text-elite-gold">
                    ${selected.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted">
                  Order Status
                </label>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    updateOrder(selected._id, {
                      status: e.target.value as OrderStatus,
                    })
                  }
                  className="admin-select mt-2"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted">
                  Payment Status
                </label>
                <select
                  value={selected.paymentStatus}
                  onChange={(e) =>
                    updateOrder(selected._id, {
                      paymentStatus: e.target.value as PaymentStatus,
                    })
                  }
                  className="admin-select mt-2"
                >
                  {PAYMENT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-elite-muted">
                {selected.paymentMethod} · {selected.shippingMethod}
              </p>

              {selected.notes && (
                <p className="text-sm text-white/60 italic border-l-2 border-elite-gold/40 pl-3">
                  {selected.notes}
                </p>
              )}

              <button
                type="button"
                onClick={() => deleteOrder(selected._id)}
                className="flex items-center gap-2 text-red-400/80 hover:text-red-400 text-xs uppercase tracking-wider transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete order
              </button>
            </div>
          ) : (
            <AdminEmpty message="Select an order to view details" />
          )}
        </div>
      </div>
    </div>
  );
}
