"use client";

import type { Product } from "@/types";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingCart, SlidersHorizontal } from "lucide-react";

const BILL_CATEGORIES = ["USD", "CAD", "EURO", "GBP"] as const;

type BillCategory = (typeof BILL_CATEGORIES)[number] | "ALL";

const FILTER_OPTIONS: { value: BillCategory; label: string }[] = [
  { value: "ALL", label: "All Bills" },
  { value: "USD", label: "USD" },
  { value: "EURO", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
];

export default function BillsPage() {
  const [bills, setBills] = useState<Product[]>([]);
  const [category, setCategory] = useState<BillCategory>("ALL");
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/addProduct");
        if (!res.ok) return;
        const data: Product[] = await res.json();
        setBills(
          data.filter((item) =>
            BILL_CATEGORIES.includes(
              item.category?.toUpperCase() as (typeof BILL_CATEGORIES)[number]
            )
          )
        );
      } catch {
        // Page still renders
      } finally {
        setIsLoading(false);
      }
    };
    fetchBills();
  }, []);

  const filteredBills = useMemo(() => {
    let result = [...bills];

    if (category !== "ALL") {
      result = result.filter(
        (bill) => bill.category?.toUpperCase() === category
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (bill) =>
          bill.title.toLowerCase().includes(q) ||
          bill.category?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [bills, category, searchQuery, sortOption]);

  return (
    <div className="min-h-screen bg-elite-bg">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>

      <div className="relative h-[50vh] min-h-[320px] w-full pt-16">
        <div className="absolute inset-0">
          <Image
            src="/images/dollarbill.jpeg"
            fill
            className="object-cover"
            alt="All Bills"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-elite-bg" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-elite-gold drop-shadow-lg font-display">
            All Bills
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl">
            Browse and filter USD, EUR, GBP, and CAD bills in one place.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-elite-surface/50 backdrop-blur-sm p-6 border border-elite-border mb-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCategory(option.value)}
                className={`px-4 py-2 text-sm font-medium border transition-colors ${
                  category === option.value
                    ? "bg-elite-gold text-black border-elite-gold"
                    : "bg-elite-bg/50 text-white border-elite-border hover:border-elite-gold"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search bills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-elite-bg/50 text-white pl-12 pr-4 py-3 border border-elite-border focus:border-elite-gold focus:ring-2 focus:ring-elite-gold/20 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="relative w-full md:w-52">
              <select
                className="w-full appearance-none bg-elite-bg/50 text-white pl-12 pr-4 py-3 border border-elite-border focus:border-elite-gold focus:ring-2 focus:ring-elite-gold/20"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Default sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <p className="text-elite-muted text-sm">
            Showing {filteredBills.length} of {bills.length} bills
            {category !== "ALL" ? ` · ${category}` : ""}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-elite-surface/50 h-[400px] animate-pulse"
              />
            ))}
          </div>
        ) : filteredBills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBills.map((bill) => (
              <Link
                key={bill._id}
                href={`/products/${bill._id}`}
                className="group bg-elite-surface/50 border border-elite-border hover:border-elite-gold overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative aspect-square overflow-hidden">
                  {bill.image && (
                    <Image
                      src={bill.image}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={bill.title}
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-black/70 text-elite-gold text-xs font-bold px-2 py-1 uppercase">
                    {bill.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-elite-gold/90 text-black px-3 py-1.5 font-bold">
                    {bill.currency} {bill.price}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                    {bill.title}
                  </h2>
                  <span className="w-full flex items-center justify-center gap-2 bg-elite-gold hover:bg-elite-gold-light text-black font-medium py-3 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    Shop Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-elite-surface/50 border border-elite-border">
            <p className="text-elite-muted text-lg">No bills found</p>
            {category !== "ALL" && (
              <button
                type="button"
                onClick={() => setCategory("ALL")}
                className="mt-4 text-elite-gold hover:underline text-sm"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
