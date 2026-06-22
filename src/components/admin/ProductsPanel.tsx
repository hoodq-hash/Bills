"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Package, Pencil, Trash2, Upload, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductFormData } from "@/types";
import { ADMIN_CATEGORIES } from "@/constants/catalog";
import { AdminEmpty } from "./AdminUI";
import ProductPreview from "./ProductPreview";

const CATEGORIES = [...ADMIN_CATEGORIES];

const emptyForm: ProductFormData = {
  title: "",
  description: "",
  price: "",
  category: "",
  image: null,
  design: "",
  currency: "",
  mog: "",
  bills_quantity: "",
};

interface ProductsPanelProps {
  mode: "list" | "form";
  editingProduct: Product | null;
  onEdit: (product: Product) => void;
  onAdd?: () => void;
  onCancelEdit: () => void;
  onSaved: () => void;
}

export default function ProductsPanel({
  mode,
  editingProduct,
  onEdit,
  onAdd,
  onCancelEdit,
  onSaved,
}: ProductsPanelProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    if (res.ok) setProducts(await res.json());
  };

  useEffect(() => {
    if (mode === "list") fetchProducts();
  }, [mode]);

  useEffect(() => {
    if (mode === "form" && editingProduct) {
      setForm({
        title: editingProduct.title,
        description: editingProduct.description,
        price: String(editingProduct.price),
        category: editingProduct.category,
        image: editingProduct.image || null,
        design: editingProduct.design,
        currency: editingProduct.currency,
        mog: editingProduct.mog,
        bills_quantity: editingProduct.bills_quantity,
      });
    } else if (mode === "form" && !editingProduct) {
      setForm(emptyForm);
    }
  }, [mode, editingProduct]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: localPreview }));
    setUploadingImage(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      URL.revokeObjectURL(localPreview);
      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success("Image uploaded to Cloudinary");
    } catch (err) {
      URL.revokeObjectURL(localPreview);
      setForm((prev) => ({
        ...prev,
        image: editingProduct?.image || null,
      }));
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const removeImage = () => {
    if (form.image?.startsWith("blob:")) URL.revokeObjectURL(form.image);
    setForm((prev) => ({ ...prev, image: null }));
  };

  const validate = () => {
    if (!form.title.trim()) return toast.error("Title is required"), false;
    if (!form.description.trim()) return toast.error("Description is required"), false;
    if (!form.price || isNaN(Number(form.price))) return toast.error("Valid price required"), false;
    if (!form.category) return toast.error("Category is required"), false;
    if (!form.design) return toast.error("Design is required"), false;
    if (!form.currency) return toast.error("Currency is required"), false;
    if (!form.mog) return toast.error("MOQ is required"), false;
    if (!form.bills_quantity) return toast.error("Bills quantity is required"), false;
    if (uploadingImage) return toast.error("Wait for image upload to finish"), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editingProduct ? "Product updated" : "Product created");
        setForm(emptyForm);
        onSaved();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save product");
      }
    } catch {
      toast.error("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      fetchProducts();
    } else {
      toast.error("Failed to delete product");
    }
  };

  if (mode === "list") {
    return (
      <div>
        {onAdd && (
          <div className="flex justify-end mb-6">
            <button type="button" onClick={onAdd} className="btn-primary gap-2">
              <Package className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className="admin-card">
            <AdminEmpty message="No products in catalog yet" />
            {onAdd && (
              <div className="flex justify-center pb-10">
                <button type="button" onClick={onAdd} className="btn-primary gap-2">
                  <Package className="w-3.5 h-3.5" />
                  Add Your First Product
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div key={product._id} className="admin-card overflow-hidden group">
                {product.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-elite-gold text-black font-sans text-[10px] uppercase tracking-wider px-2 py-1">
                      {product.currency} {product.price}
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-gold mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-display font-light italic text-lg text-white mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-elite-muted line-clamp-2 mb-5">
                    {product.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="btn-primary flex-1 gap-2 py-2.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className="btn-secondary px-4 py-2.5 text-red-400/80 border-red-500/30 hover:border-red-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const fieldClass = "input-elite text-sm mt-2";
  const labelClass =
    "font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted block";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
      {/* Form — left */}
      <div className="admin-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className={labelClass}>
              Product Name *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className={labelClass}>Product Image</label>
            <div className="relative mt-2">
              <label className="flex flex-col items-center justify-center h-44 border border-dashed border-elite-border cursor-pointer hover:border-elite-gold/50 bg-black/20 transition-colors">
                {form.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={form.image}
                      alt="Preview"
                      fill
                      className="object-contain p-2"
                      unoptimized={form.image.startsWith("blob:")}
                    />
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-elite-gold animate-spin" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-elite-muted py-8">
                    <Upload className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="font-sans text-xs uppercase tracking-wider">
                      Upload to Cloudinary
                    </p>
                    <p className="font-sans text-[10px] text-elite-muted/70 mt-1">
                      JPG, PNG — max 5MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={uploadingImage}
                />
              </label>
              {form.image && !uploadingImage && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 text-white/70 hover:text-white transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {form.image?.includes("cloudinary") && (
              <p className="font-sans text-[10px] text-emerald-400/80 mt-2 uppercase tracking-wider">
                Stored on Cloudinary
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={fieldClass}
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="price" className={labelClass}>
                Price *
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={fieldClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="category" className={labelClass}>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`${fieldClass} admin-select`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            {(["currency", "design", "mog", "bills_quantity"] as const).map((field) => (
              <div key={field}>
                <label htmlFor={field} className={labelClass}>
                  {field === "mog" ? "MOQ" : field.replace("_", " ")} *
                </label>
                <input
                  id={field}
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={onCancelEdit} className="btn-secondary py-3 px-6">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="btn-primary gap-2 py-3 px-6 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {loading
                ? "Saving..."
                : editingProduct
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Preview — right */}
      <aside className="xl:sticky xl:top-24">
        <ProductPreview form={form} />
      </aside>
    </div>
  );
}
