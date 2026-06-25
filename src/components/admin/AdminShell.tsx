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
  ExternalLink,
} from "lucide-react";
import type { ReactNode } from "react";
import { AdminPageHeader } from "./AdminUI";
import Logo from "@/components/Logo/Logo";

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
  headerTitle?: string;
  headerSubtitle?: string;
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
  { section: "allProducts", label: "All Products", icon: Package, group: "Catalog" },
  { section: "addProduct", label: "Add Product", icon: PackagePlus, group: "Catalog" },
];

const sectionMeta: Record<
  Exclude<AdminSection, "logout">,
  { eyebrow: string; title: string; subtitle: string }
> = {
  dashboard: {
    eyebrow: "Overview",
    title: "Store Dashboard",
    subtitle: "Performance at a glance — orders, revenue, and catalog.",
  },
  orders: {
    eyebrow: "Sales",
    title: "Order Management",
    subtitle: "Review, update status, and fulfill customer orders.",
  },
  receipts: {
    eyebrow: "Sales",
    title: "Receipts",
    subtitle: "Search and print official order receipts.",
  },
  customers: {
    eyebrow: "Sales",
    title: "Customers",
    subtitle: "Client history compiled from order records.",
  },
  allProducts: {
    eyebrow: "Catalog",
    title: "Product Inventory",
    subtitle: "View and manage all bills and catalog items.",
  },
  addProduct: {
    eyebrow: "Catalog",
    title: "Add Product",
    subtitle: "Create or edit a product — preview updates live on the right.",
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
  headerTitle,
  headerSubtitle,
  children,
}: AdminShellProps) {
  const groups = [...new Set(menuItems.map((i) => i.group))];
  const meta = getSectionMeta(activeSection);
  const title = headerTitle ?? meta.title;
  const subtitle = headerSubtitle ?? meta.subtitle;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-elite-bg">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-black/90 backdrop-blur-md">
        <div className="h-full zenith-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 hidden sm:block">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.18em] text-white/50 hover:text-elite-gold transition-colors"
            >
              View Store
              <ExternalLink className="w-3 h-3" />
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-8 h-8 border border-elite-gold/40 flex items-center justify-center bg-elite-gold/10">
                <span className="font-sans text-[10px] font-medium text-elite-gold">
                  {initials}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="font-sans text-sm text-white/90">{userName}</p>
                <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-elite-muted">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <aside className="hidden md:flex fixed left-0 top-16 w-[240px] h-[calc(100vh-4rem)] border-r border-white/10 bg-[#0a0a0f] flex-col">
          <nav className="flex-1 overflow-y-auto py-6">
            {groups.map((group) => (
              <div key={group} className="mb-8">
                <p className="px-5 mb-3 font-sans text-[9px] uppercase tracking-[0.28em] text-elite-gold/70">
                  {group}
                </p>
                <ul>
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
                            className={`admin-sidebar-link ${active ? "admin-sidebar-link-active" : ""}`}
                          >
                            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              type="button"
              onClick={onLogout}
              className="admin-sidebar-link text-red-400/70 hover:text-red-400 w-full"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Log Out
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 md:ml-[240px]">
          <div className="zenith-container py-8 md:py-10 pb-24 md:pb-10">
            {activeSection !== "logout" && (
              <AdminPageHeader
                eyebrow={meta.eyebrow}
                title={title}
                subtitle={subtitle}
              />
            )}
            {children}
          </div>
        </main>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-md">
        <div className="flex justify-around py-2">
          {[
            menuItems[0], // Dashboard
            menuItems[1], // Orders
            menuItems[4], // All Products
            menuItems[5], // Add Product
            menuItems[2], // Receipts
          ].map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.section;
            return (
              <button
                key={item.section}
                type="button"
                onClick={() => onSectionChange(item.section)}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 font-sans text-[9px] uppercase tracking-wider ${
                  active ? "text-elite-gold" : "text-white/40"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
