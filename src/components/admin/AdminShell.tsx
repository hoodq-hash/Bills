"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Users,
  Package,
  PackagePlus,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import type { ReactNode } from "react";

export type AdminSection =
  | "dashboard"
  | "orders"
  | "receipts"
  | "customers"
  | "allProducts"
  | "addProduct"
  | "logout";

interface AdminShellProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
  userName?: string;
  children: ReactNode;
}

const menuItems: {
  section: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
  group?: string;
}[] = [
  { section: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { section: "orders", label: "Orders", icon: ShoppingBag, group: "Sales" },
  { section: "receipts", label: "Receipts", icon: Receipt, group: "Sales" },
  { section: "customers", label: "Customers", icon: Users, group: "Sales" },
  { section: "allProducts", label: "All Bills", icon: Package, group: "Bills" },
  { section: "addProduct", label: "Add Bill", icon: PackagePlus, group: "Bills" },
];

const sectionMeta: Record<
  Exclude<AdminSection, "logout">,
  { title: string; subtitle: string }
> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview of your store performance",
  },
  orders: {
    title: "Orders",
    subtitle: "Manage and update customer orders",
  },
  receipts: {
    title: "Receipts",
    subtitle: "View and print order receipts",
  },
  customers: {
    title: "Customers",
    subtitle: "Customer list from order history",
  },
  allProducts: {
    title: "All Bills",
    subtitle: "Manage your bill inventory",
  },
  addProduct: {
    title: "Add Bill",
    subtitle: "Create a new bill listing",
  },
};

export function getSectionMeta(section: AdminSection) {
  if (section === "logout") return sectionMeta.dashboard;
  return sectionMeta[section];
}

export default function AdminShell({
  activeSection,
  onSectionChange,
  onLogout,
  userName = "Admin",
  children,
}: AdminShellProps) {
  const groups = [...new Set(menuItems.map((i) => i.group))];

  return (
    <div className="min-h-screen bg-elite-bg">
      <nav className="fixed top-0 left-0 right-0 bg-elite-surface border-b border-elite-border z-50 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold font-display text-elite-gold">
              ELITE NOTES
            </Link>
            <span className="hidden md:inline text-xs text-elite-muted border-l border-elite-border pl-4">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" className="p-2 hover:bg-elite-card rounded-full relative">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside className="hidden md:flex fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-elite-surface border-r border-elite-border flex-col">
          <nav className="p-4 flex-1 overflow-y-auto">
            {groups.map((group) => (
              <div key={group} className="mb-6">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                  {group}
                </h2>
                <ul className="space-y-1">
                  {menuItems
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const Icon = item.icon;
                      const active = activeSection === item.section;
                      return (
                        <li key={item.section}>
                          <button
                            type="button"
                            onClick={() => onSectionChange(item.section)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                              active
                                ? "bg-elite-gold text-black font-medium"
                                : "text-slate-300 hover:bg-elite-card"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-elite-border">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </aside>

        <main className="flex-1 w-full min-w-0 md:ml-64 p-4 md:p-6 pb-20 md:pb-6">
          {activeSection !== "logout" && (
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white font-display">
                {getSectionMeta(activeSection).title}
              </h1>
              <p className="mt-1 text-slate-400">
                {getSectionMeta(activeSection).subtitle}
              </p>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-elite-surface border-t border-elite-border z-50 flex justify-around py-2">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.section}
              type="button"
              onClick={() => onSectionChange(item.section)}
              className={`flex flex-col items-center p-2 text-xs ${
                activeSection === item.section ? "text-elite-gold" : "text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {item.label.split(" ")[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
