import type { ReactNode } from "react";

export function AdminLoading() {
  return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border border-elite-gold/30 border-t-elite-gold animate-spin" />
    </div>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <p className="font-sans text-sm text-elite-muted text-center py-16">{message}</p>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const classMap: Record<string, string> = {
    pending: "admin-badge-pending",
    paid: "admin-badge-paid",
    processing: "admin-badge-processing",
    shipped: "admin-badge-shipped",
    delivered: "admin-badge-delivered",
    cancelled: "admin-badge-cancelled",
    failed: "admin-badge-failed",
  };

  return (
    <span className={classMap[key] || "admin-badge border-white/20 text-white/50 bg-white/5"}>
      {status}
    </span>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
      <div>
        <p className="section-eyebrow mb-3">{eyebrow}</p>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
