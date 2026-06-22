"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, ShoppingBag } from "lucide-react";
import type { Order } from "@/types";
import { AdminLoading, AdminEmpty } from "./AdminUI";

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
          Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent)
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div className="pb-20 md:pb-0">
      <div className="admin-card overflow-hidden">
        {customers.length === 0 ? (
          <AdminEmpty message="No customers yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.email}>
                    <td>
                      <p className="font-display font-light italic text-base text-white">
                        {c.name}
                      </p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-xs text-elite-muted mb-1">
                        <Mail className="w-3 h-3 text-elite-gold/60" />
                        {c.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-elite-muted">
                        <Phone className="w-3 h-3 text-elite-gold/60" />
                        {c.phone}
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-2 text-white/80">
                        <ShoppingBag className="w-3.5 h-3.5 text-elite-gold/70" />
                        {c.orderCount}
                      </span>
                    </td>
                    <td>
                      <span className="font-display font-light italic text-elite-gold">
                        ${c.totalSpent.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-elite-muted">
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
