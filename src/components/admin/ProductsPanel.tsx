"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Package,
  Pencil,
  Trash2,
  Tag,
  Upload,
  FileText,
  DollarSign,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductFormData } from "@/types";
import { ADMIN_CATEGORIES } from "@/constants/catalog";

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
  onCancelEdit: () => void;
  onSaved: () => void;
}

export default function ProductsPanel({
  mode,
  editingProduct,
  onEdit,
  onCancelEdit,
  onSaved,
}: ProductsPanelProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);

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

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : "/api/addProduct";
      const res = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editingProduct ? "Bill updated" : "Bill created");
        setForm(emptyForm);
        onSaved();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save bill");
      }
    } catch {
      toast.error("Error saving bill");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bill?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Bill deleted");
      fetchProducts();
    }
  };

  if (mode === "list") {
    return (
      <div className="bg-elite-surface border border-elite-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-elite-bg rounded-lg border border-elite-border overflow-hidden"
            >
              {product.image && (
                <div className="relative h-48 w-full">
                  <Image src={product.image} alt={product.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{product.title}</h3>
                <div className="space-y-1 text-sm text-slate-300">
                  <p className="line-clamp-2">{product.description}</p>
                  <p className="text-elite-gold font-semibold">
                    {product.currency} {product.price}
                  </p>
                  <p>Category: {product.category}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-elite-gold text-black rounded-lg text-sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 text-white rounded-lg text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {products.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No bills found</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-elite-surface border border-elite-border rounded-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <label className="flex items-center text-sm text-gray-300 mb-1">
            <Tag className="mr-2 h-4 w-4" />
            Bill name*
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-elite-bg/50 border border-elite-border text-white rounded-lg"
            placeholder="Enter bill name"
          />
        </div>

        <div>
          <label className="flex items-center text-sm text-gray-300 mb-1">
            <Upload className="mr-2 h-4 w-4" />
            Bill Image
          </label>
          <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-elite-border rounded-lg cursor-pointer hover:border-elite-gold bg-elite-bg/30">
            {form.image ? (
              <div className="relative w-full h-full">
                <Image src={form.image} alt="Preview" fill className="object-contain p-2" />
              </div>
            ) : (
              <div className="text-center text-slate-400">
                <Upload className="mx-auto h-10 w-10 mb-2" />
                <p className="text-sm">Click to upload (max 5MB)</p>
              </div>
            )}
            <input type="file" className="hidden" onChange={handleImage} accept="image/*" />
          </label>
        </div>

        <div>
          <label className="flex items-center text-sm text-gray-300 mb-1">
            <FileText className="mr-2 h-4 w-4" />
            Description*
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 bg-elite-bg/50 border border-elite-border text-white rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm text-gray-300 mb-1">
              <DollarSign className="mr-2 h-4 w-4" />
              Price*
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-elite-bg/50 border border-elite-border text-white rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Category*</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-elite-bg/50 border border-elite-border text-white rounded-lg"
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
              <label className="text-sm text-gray-300 mb-1 block capitalize">
                {field.replace("_", " ")}*
              </label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-elite-bg/50 border border-elite-border text-white rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-elite-gold text-black rounded-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : editingProduct ? "Update Bill" : "Save Bill"}
          </button>
        </div>
      </form>
    </div>
  );
}
