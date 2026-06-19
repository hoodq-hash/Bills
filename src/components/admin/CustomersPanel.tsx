"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, ShoppingBag } from "lucide-react";
import type { Order } from "@/types";

interface CustomerSummary {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

export default function CustomersPanel() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((orders: Order[]) => {
        const map = new Map<string, CustomerSummary>();

        orders.forEach((order) => {
          const email = order.customer.email.toLowerCase();
          const existing = map.get(email);
          const date = order.createdAt || new Date().toISOString();

          if (existing) {
            existing.orderCount += 1;
            existing.totalSpent += order.total;
            if (date > existing.lastOrder) existing.lastOrder = date;
          } else {
            map.set(email, {
              email: order.customer.email,
              name: `${order.customer.firstName} ${order.customer.lastName}`,
              phone: order.customer.phone,
              orderCount: 1,
              totalSpent: order.total,
              lastOrder: date,
            });
          }
        });

        setCustomers(
          Array.from(map.values()).sort(
            (a, b) => b.totalSpent - a.totalSpent
          )
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-elite-gold" />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0">
      <div className="bg-elite-surface border border-elite-border rounded-xl overflow-hidden">
        {customers.length === 0 ? (
          <p className="text-slate-400 text-center py-16">No customers yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-elite-bg/50 text-slate-400">
                <tr>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Contact</th>
                  <th className="text-left px-6 py-3">Orders</th>
                  <th className="text-left px-6 py-3">Total Spent</th>
                  <th className="text-left px-6 py-3">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr
                    key={c.email}
                    className="border-t border-elite-border text-slate-300"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{c.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                        <Mail className="w-3 h-3" />
                        {c.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-4 h-4 text-elite-gold" />
                        {c.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-elite-gold font-medium">
                      ${c.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(c.lastOrder).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
