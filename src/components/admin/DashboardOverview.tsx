"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Clock,
  DollarSign,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import type { AdminStats, Order } from "@/types";

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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-elite-gold" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      label: "Pending",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      label: "Revenue (Paid)",
      value: `$${(stats?.totalRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-elite-gold",
    },
    {
      label: "Customers",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "text-purple-400",
    },
    {
      label: "Bills",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-green-400",
    },
    {
      label: "Paid Orders",
      value: stats?.paidOrders ?? 0,
      icon: TrendingUp,
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-elite-surface border border-elite-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-sm text-slate-400 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-elite-surface border border-elite-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-elite-border">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-elite-bg/50 text-slate-400">
                <tr>
                  <th className="text-left px-6 py-3">Order #</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Total</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-elite-border text-slate-300"
                  >
                    <td className="px-6 py-3 font-mono text-elite-gold">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-3">
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td className="px-6 py-3">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-3 capitalize">{order.status}</td>
                    <td className="px-6 py-3">
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
