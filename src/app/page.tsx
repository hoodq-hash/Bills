"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Lock,
  Globe,
  Headphones,
  Package,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import type { Product } from "@/types";

const BILL_CATEGORIES = ["USD", "CAD", "EURO", "GBP"];

const features = [
  {
    icon: Lock,
    title: "Secure Transactions",
    description: "End-to-end encryption for all your transactions",
  },
  {
    icon: Globe,
    title: "Worldwide Acceptance",
    description: "Bills accepted in stores and businesses worldwide",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer assistance",
  },
  {
    icon: Package,
    title: "Discrete Shipping",
    description: "100% confidential packaging and delivery",
  },
];

function ProductGrid({
  products,
  emptyLabel = "No bills found",
}: {
  products: Product[];
  emptyLabel?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-elite-surface/50 border border-elite-border rounded-xl">
        <p className="text-elite-muted text-lg">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/products/${product._id}`}
          className="group bg-elite-surface border border-elite-border overflow-hidden hover:border-elite-gold transition-all duration-300"
        >
          <div className="relative aspect-square overflow-hidden">
            {product.image && (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute top-4 right-4 bg-elite-gold/90 text-black px-3 py-1.5 text-sm font-bold">
              {product.currency} {product.price}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
              {product.title}
            </h3>
            <span className="w-full flex items-center justify-center gap-2 bg-elite-gold hover:bg-elite-gold-light text-black font-semibold text-xs uppercase tracking-wide py-2.5 transition-colors">
              <ShoppingCart className="w-4 h-4" />
              Shop Now
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ProductSectionHeader({
  title,
  count,
  total,
}: {
  title: string;
  count: number;
  total: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-8">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
        {title}
      </h2>
      <p className="text-elite-muted text-sm">
        Showing 1-{count} of {total} bills
      </p>
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [cloneProducts, setCloneProducts] = useState<Product[]>([]);
  const [billProducts, setBillProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/addProduct");
        if (!res.ok) return;
        const data: Product[] = await res.json();
        // setCloneProducts(
        //   data.filter((p) => p.category?.toLowerCase() === "clone cards")
        // );
        setBillProducts(
          data.filter((p) =>
            BILL_CATEGORIES.includes(p.category?.toUpperCase() ?? "")
          )
        );
      } catch {
        // Homepage still renders if API is unavailable
      }
    };
    loadProducts();
  }, []);

  // const featuredClones = cloneProducts.slice(0, 4);
  const featuredBills = billProducts.slice(0, 4);

  return (
    <div className="min-h-screen bg-elite-bg">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/dollarbill.jpeg"
            alt="Elite Notes — Premium Bills"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-elite-bg via-black/40 to-black/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase leading-tight mb-6">
            Buy Undetectable Counterfeit Bills Online from{" "}
            <span className="text-elite-gold">Elite Notes</span>
          </h1>
          <p className="text-base md:text-lg text-white/85 max-w-3xl mx-auto mb-10 leading-relaxed">
            Our premium bills are crafted to pass standard checks and look
            genuine in hand. Available in USD, EUR, GBP, and CAD with discreet
            worldwide shipping and 100% confidential packaging.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/bills"
              className="btn-primary px-10 py-3.5 text-sm w-full sm:w-auto text-center"
            >
              Shop Bills
            </Link>
            <Link
              href="/reviews"
              className="btn-secondary px-10 py-3.5 text-sm w-full sm:w-auto text-center"
            >
              Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-6 bg-elite-surface/40 border-y border-elite-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="text-center p-6 border border-elite-border bg-elite-bg/60"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-elite-gold/10 mb-4">
                <Icon className="w-5 h-5 text-elite-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                {title}
              </h3>
              <p className="text-elite-muted text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Bills */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <ProductSectionHeader
            title="Featured Bills"
            count={featuredBills.length}
            total={billProducts.length}
          />
          <ProductGrid products={featuredBills} emptyLabel="No bills found" />
        </div>
      </section>

      {/* Buy Bills */}
      <section className="py-12 px-6 bg-elite-surface/30 border-y border-elite-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-elite-gold uppercase mb-6">
            Buy Counterfeit Bills Online
          </h2>
          <p className="text-white/80 leading-relaxed">
            Looking for high-quality bills for sale? We offer undetectable
            counterfeit bills in USD, Euro, GBP, and CAD — premium quality with
            discrete packing and fast international shipping.
          </p>
        </div>
      </section>

      {/* Cloned cards section — disabled
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <ProductSectionHeader
            title="Other Products"
            count={featuredClones.length}
            total={cloneProducts.length}
          />
          <ProductGrid products={featuredClones} emptyLabel="No card products found" />
        </div>
      </section>
      */}

      {/* View All Bills CTA */}
      <section className="py-16 px-6 bg-elite-surface/30 border-t border-elite-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-elite-gold uppercase mb-6">
            Shop All Bill Currencies
          </h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Browse USD, Euro, GBP, and CAD bills — 24/7 ordering available.
          </p>
          <Link
            href="/bills"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm"
          >
            View All Bills
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
