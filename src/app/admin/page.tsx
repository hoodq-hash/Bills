"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminShell, { type AdminSection } from "@/components/admin/AdminShell";
import DashboardOverview from "@/components/admin/DashboardOverview";
import OrdersPanel from "@/components/admin/OrdersPanel";
import ReceiptsPanel from "@/components/admin/ReceiptsPanel";
import CustomersPanel from "@/components/admin/CustomersPanel";
import ProductsPanel from "@/components/admin/ProductsPanel";
import type { Product } from "@/types";
import { ensureDevAdminSession, hasAdminSession, isDevAuthBypass } from "@/utils/devAuth";

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [authLoading, setAuthLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (isDevAuthBypass) {
      ensureDevAdminSession();
      setAuthLoading(false);
      return;
    }
    if (!hasAdminSession()) {
      router.push("/login");
      return;
    }
    setAuthLoading(false);
  }, [router]);

  const handleSectionChange = (section: AdminSection) => {
    if (section === "logout") {
      logout();
      router.push("/login");
      return;
    }
    setActiveSection(section);
    if (section === "addProduct" && !editingProduct) {
      setEditingProduct(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveSection("addProduct");
  };

  const handleProductSaved = () => {
    setEditingProduct(null);
    setActiveSection("allProducts");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-elite-bg flex items-center justify-center">
        <div className="w-8 h-8 border border-elite-gold/30 border-t-elite-gold animate-spin" />
      </div>
    );
  }

  return (
    <AdminShell
      activeSection={activeSection}
      onSectionChange={handleSectionChange}
      onLogout={() => {
        logout();
        router.push("/login");
      }}
      userName={user?.name || "Admin"}
      headerTitle={
        activeSection === "addProduct" && editingProduct
          ? "Edit Product"
          : undefined
      }
      headerSubtitle={
        activeSection === "addProduct" && editingProduct
          ? `Updating "${editingProduct.title}"`
          : undefined
      }
    >
      {activeSection === "dashboard" && <DashboardOverview />}
      {activeSection === "orders" && <OrdersPanel />}
      {activeSection === "receipts" && <ReceiptsPanel />}
      {activeSection === "customers" && <CustomersPanel />}
      {activeSection === "allProducts" && (
        <ProductsPanel
          mode="list"
          editingProduct={null}
          onEdit={handleEditProduct}
          onAdd={() => {
            setEditingProduct(null);
            setActiveSection("addProduct");
          }}
          onCancelEdit={() => setActiveSection("allProducts")}
          onSaved={handleProductSaved}
        />
      )}
      {activeSection === "addProduct" && (
        <ProductsPanel
          mode="form"
          editingProduct={editingProduct}
          onEdit={handleEditProduct}
          onCancelEdit={() => {
            setEditingProduct(null);
            setActiveSection("allProducts");
          }}
          onSaved={handleProductSaved}
        />
      )}
    </AdminShell>
  );
}
