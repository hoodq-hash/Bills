"use client";

import Image from "next/image";
import { ShoppingCart, ImageIcon } from "lucide-react";
import type { ProductFormData } from "@/types";

interface ProductPreviewProps {
  form: ProductFormData;
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-white/5 last:border-0">
      <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-elite-muted shrink-0">
        {label}
      </span>
      <span className="font-sans text-sm text-white/85 text-right">{value || "—"}</span>
    </div>
  );
}

export default function ProductPreview({ form }: ProductPreviewProps) {
  const priceDisplay =
    form.price && !isNaN(Number(form.price))
      ? `${form.currency || "$"} ${Number(form.price).toFixed(2)}`
      : "—";

  return (
    <div className="space-y-5">
      <div>
        <p className="section-eyebrow mb-3">Live Preview</p>
        <p className="font-sans text-xs text-elite-muted">
          How this product will appear on the storefront
        </p>
      </div>

      {/* Storefront card */}
      <div className="zenith-card overflow-hidden p-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
          {form.image ? (
            <Image
              src={form.image}
              alt={form.title || "Product preview"}
              fill
              className="object-cover"
              unoptimized={form.image.startsWith("blob:")}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-elite-muted">
              <ImageIcon className="w-10 h-10 mb-2 opacity-40" strokeWidth={1} />
              <span className="font-sans text-[10px] uppercase tracking-wider">
                No image yet
              </span>
            </div>
          )}
          {form.price && (
            <div className="absolute top-3 right-3 bg-elite-gold text-black font-sans text-[10px] uppercase tracking-wider px-2 py-1">
              {form.currency || "USD"} {form.price}
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-gold mb-2">
            {form.category || "Category"}
          </p>
          <h3 className="font-display font-light italic text-lg text-white mb-2 line-clamp-2">
            {form.title || "Product Title"}
          </h3>
          <p className="text-sm text-elite-muted line-clamp-3 mb-4 min-h-[3.75rem]">
            {form.description || "Product description will appear here..."}
          </p>
          <span className="flex items-center justify-center gap-2 w-full py-2.5 bg-elite-gold/10 border border-elite-gold/30 text-elite-gold text-xs uppercase tracking-wider">
            <ShoppingCart className="w-4 h-4" />
            Shop Now
          </span>
        </div>
      </div>

      {/* Product document / spec sheet */}
      <div className="admin-card p-6">
        <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-elite-gold mb-4">
          Product Document
        </p>
        <h4 className="font-display font-light italic text-xl text-white mb-1">
          {form.title || "Untitled Product"}
        </h4>
        <p className="font-sans text-xs text-elite-muted mb-5">{form.category || "No category"}</p>

        <div className="space-y-0">
          <PreviewField label="Price" value={priceDisplay} />
          <PreviewField label="Currency" value={form.currency} />
          <PreviewField label="Design" value={form.design} />
          <PreviewField label="MOQ" value={form.mog} />
          <PreviewField label="Bills Qty" value={form.bills_quantity} />
        </div>

        {form.description && (
          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-elite-muted mb-2">
              Description
            </p>
            <p className="font-sans text-sm text-white/75 leading-relaxed whitespace-pre-wrap">
              {form.description}
            </p>
          </div>
        )}

        {form.image && (
          <p className="mt-4 font-sans text-[10px] text-elite-muted truncate">
            Image: {form.image.includes("cloudinary") ? "Cloudinary ✓" : "Local preview"}
          </p>
        )}
      </div>
    </div>
  );
}
