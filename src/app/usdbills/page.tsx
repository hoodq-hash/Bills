"use client";
import type { Product } from "@/types";
import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer/Footer";
import { Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";


export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()


  const category = "USD";

  
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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
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

      <div className="relative h-[70vh] lg:h-[80vh] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/dollarbill.jpeg"
            fill
            className="object-cover"
            alt="Usd Bills Background"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-elite-bg" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold  text-center mb-6 text-elite-gold drop-shadow-lg">
            USD Bills
          </h1>
        </div>
      </div>

      <div className="bg-elite-surface/50 backdrop-blur-sm p-6  border border-elite-border mb-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search bills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-elite-bg/50 text-white pl-12 pr-4 py-3  border border-elite-border focus:border-elite-gold focus:ring-2 focus:ring-elite-gold/20 transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <div className="relative w-full md:w-48">
            <select
              className="w-full appearance-none bg-elite-bg/50 text-white pl-12 pr-4 py-3  border border-elite-border focus:border-elite-gold focus:ring-2 focus:ring-elite-gold/20 transition-all duration-300"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="default">Default sorting</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <SlidersHorizontal className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="prose max-w-none mb-12">
          <h2 className="text-2xl font-bold text-elite-gold mb-4">
            USD Counterfeit Banknotes / USD Bills / USD Banknotes
          </h2>
          <p className="text-gray-200">
            According to the United States Department of Treasury, an estimated{" "}
            <span className="font-bold text-elite-gold">
              $70 million in USD Counterfeit Banknotes
            </span>{" "}
            are in circulation, or{" "}
            <span className="font-bold text-elite-gold">
              approximately 1 note in counterfeits for every 10,000 in genuine
              currency
            </span>
            , with an upper bound of $200 million counterfeit.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-elite-surface/50  h-[400px] animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-elite-surface/50 backdrop-blur-sm  border border-elite-border hover:border-elite-gold overflow-hidden transition-all duration-500 hover:transform hover:scale-[1.02]"
                onClick={()=>router.push(`/${product._id}`)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={product.title}
                  />
                  <div className="absolute top-4 right-4 bg-elite-gold/90 backdrop-blur-sm text-black px-4 py-2  font-bold">
                    ${product.price}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {product.title}
                  </h4>
                  <Link href={`/products/${product._id}`}>
                    <button className="w-full bg-elite-gold text-black font-medium py-3 px-4  transition-all duration-300 flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      SHOP NOW
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-elite-surface/50 backdrop-blur-sm  border border-elite-border">
            <p className="text-gray-400 text-lg">No bills found</p>
          </div>
        )}

        <div className="prose max-w-6xl mx-auto">
          {[
            {
              title: "Counterfeit Money / USD Counterfeit Banknotes",
              content: `USD Counterfeit Banknotes are currencies produced without the legal sanction of a state or government...`,
            },
            {
              title: "Effects / Penalties of Using USD Counterfeit Banknotes",
              content: `One of the effects counterfeit money has on society is a reduction in the value of real money...`,
            },
            // Add other sections similarly
          ].map((section, index) => (
            <section key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-elite-gold mb-4">
                {section.title}
              </h2>
              <p className="text-white leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
