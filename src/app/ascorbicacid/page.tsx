"use client";

import type { Product } from "@/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { ASCORBIC_ACID_CATEGORY } from "@/constants/catalog";

export default function AscorbicAcidPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/addProduct?category=${encodeURIComponent(ASCORBIC_ACID_CATEGORY)}`
        );
        if (res.ok) {
          setProducts(await res.json());
        }
      } catch {
        // Page still renders
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
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

  const filteredProducts = sortedProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-elite-bg">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="relative h-[70vh] lg:h-[80vh] w-full pt-16">
        <div className="absolute inset-0">
          <Image
            src="/images/images.jpeg"
            fill
            className="object-cover"
            alt="Ascorbic Acid"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-elite-bg" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-elite-gold drop-shadow-lg font-display">
            Ascorbic Acid
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl">
            Premium-grade ascorbic acid products with discreet worldwide shipping.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 -mt-20">
        <div className="bg-elite-surface/50 backdrop-blur-sm p-6 border border-elite-border mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search ascorbic acid products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-elite-bg/50 text-white pl-12 pr-4 py-3 border border-elite-border focus:border-elite-gold focus:ring-2 focus:ring-elite-gold/20"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="relative w-full md:w-48">
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
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-elite-surface/50 h-[400px] animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group bg-elite-surface/50 border border-elite-border hover:border-elite-gold overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative aspect-square overflow-hidden">
                  {product.image && (
                    <Image
                      src={product.image}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={product.title}
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-elite-gold/90 text-black px-3 py-1.5 font-bold">
                    {product.currency} {product.price}
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {product.title}
                  </h2>
                  <span className="w-full flex items-center justify-center gap-2 bg-elite-gold text-black font-medium py-3">
                    <ShoppingCart className="w-5 h-5" />
                    Shop Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-elite-surface/50 border border-elite-border">
            <p className="text-elite-muted text-lg">No ascorbic acid products found</p>
          </div>
        )}

        <div className="prose max-w-none mt-16">
          <h2 className="text-2xl font-bold text-elite-gold mb-4">
            Buy Ascorbic Acid Online
          </h2>
          <p className="text-white/80 leading-relaxed">
            Browse our ascorbic acid catalog for lab-grade and commercial-grade
            options. All orders ship with discreet packaging and tracked delivery
            where available.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
