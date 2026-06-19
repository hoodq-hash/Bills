"use client";
import type { Product } from "@/types";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { ShoppingCart} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  const category = "CAD";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/addProduct?category=${category}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);


  return (
    <div className="min-h-screen bg-elite-bg flex flex-col">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {isLoading ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-elite-surface/50  border border-elite-border overflow-hidden"
                  onClick={()=>router.push(`/${product._id}`)}               
               >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={product.title}
                    />
                    <div className="absolute top-4 right-4 bg-elite-gold/90 text-black px-4 py-2  font-bold">
                      ${product.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {product.title}
                    </h4>
                    <div className="flex justify-between items-center mb-4">
                      <button
                        className="bg-elite-gold text-black font-medium py-2 px-4  flex items-center gap-2 transition-transform duration-300 hover:scale-105"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
