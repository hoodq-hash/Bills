"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Clock, DollarSign, Users, Package, TrendingUp } from "lucide-react";
import type { AdminStats, Order } from "@/types";
import { AdminLoading, AdminEmpty, StatusBadge } from "./AdminUI";

const statConfig = [
  { key: "totalOrders" as const, label: "Total Orders", icon: ShoppingBag, format: (v: number) => String(v) },
  { key: "pendingOrders" as const, label: "Pending", icon: Clock, format: (v: number) => String(v) },
  { key: "totalRevenue" as const, label: "Revenue (Paid)", icon: DollarSign, format: (v: number) => `$${v.toFixed(2)}` },
  { key: "totalCustomers" as const, label: "Customers", icon: Users, format: (v: number) => String(v) },
  { key: "totalProducts" as const, label: "Bills Listed", icon: Package, format: (v: number) => String(v) },
  { key: "paidOrders" as const, label: "Paid Orders", icon: TrendingUp, format: (v: number) => String(v) },
];

export default function DashboardOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/orders?stats=true"),
          fetch("/api/orders"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (ordersRes.ok) {
          const orders: Order[] = await ordersRes.json();
          setRecentOrders(orders.slice(0, 5));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {statConfig.map(({ key, label, icon: Icon, format }) => (
          <div key={key} className="admin-stat-card">
            <Icon className="w-4 h-4 text-elite-gold/60 mb-4" strokeWidth={1.5} />
            <p className="admin-stat-value">{format(stats?.[key] ?? 0)}</p>
            <p className="admin-stat-label">{label}</p>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Recent Orders</h2>
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted">
            Last 5
          </span>
        </div>
        {recentOrders.length === 0 ? (
          <AdminEmpty message="No orders yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="font-mono text-elite-gold text-xs">{order.orderNumber}</td>
                    <td>
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td className="text-white">${order.total.toFixed(2)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="text-elite-muted">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
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
