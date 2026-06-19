"use client";
import type { Product } from "@/types";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {
  ShoppingCart,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const category = "clone cards";

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
        <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>
      {/* Hero Section */}
      <div className="relative h-[70vh] lg:h-[80vh] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/discreet-cloned-cards-opt.jpg"
            fill
            className="object-cover"
            alt="Cloned cards Background"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-elite-bg" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold  text-center mb-6 text-elite-gold drop-shadow-lg">
           Cloned Cards
          </h1>
        </div>
      </div>

      <div className="prose max-w-6xl mx-auto  p-4 sm:p-6 lg:p-8">
        {[
          {
            title: "Buy Cloned Cards online",
            content: `BEST PLACE TO BUY CLONE CARDS IN USA, UK, CANADA, EU A cloned card refers to making an unauthorized copy of a credit card. we use an electronic device and transfer the data from one Credit card to a new card or rewrite an existing card with the information.`,
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 -mt-20">
        {/* Controls Section */}
        <div className="bg-elite-surface/50 backdrop-blur-sm p-6  border border-elite-border mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-elite-bg/50 text-white pl-12 pr-4 py-3 rounded-xl border border-elite-border focus:border-elite-gold focus:ring-2 focus:ring-elite-gold/20 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="relative w-full md:w-48">
              <select
                className="w-full appearance-none bg-elite-bg/50 text-white pl-12 pr-4 py-3 rounded-xl border border-elite-border focus:border-elite-gold focus:ring-2 focus:ring-elite-gold/20 transition-all duration-300"
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

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-elite-surface/50  h-[400px] animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 && filteredProducts.some((product) => product.category === "clone cards") ? (
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
                  <div className="absolute top-4 right-4 bg-elite-gold/90 backdrop-blur-sm text-black px-4 py-2 font-bold">
                    ${product.price}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {product.title}
                  </h4>
                  <button className="w-full bg-elite-gold hover:bg-elite-gold-light text-black font-medium py-3 px-4 transition-all duration-300 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    SHOP NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-elite-surface/50 backdrop-blur-sm border border-elite-border">
            <p className="text-gray-400 text-lg">No products found</p>
          </div>
        )}
      </div>

      <div className="prose max-w-6xl mx-auto  p-4 sm:p-6 lg:p-8">
        {[
          {
            title: "Buy Cloned Cards online USA",
            content: `Cloned Credit Cards is a revolutionary way designed to provide users with a copy of missing cards or a chance to load founds back to their credit card. In other words, innovative way offers a hassle-free way to enjoy not being sacred of misplacing your original credit card.`,
          },
          {
            title: "Order Cloned Credit Card EU",
            content: `Looking to order Cloned credit cards, we got the best deal for you order now. Looking to place your order here. Stay tuned for a hassle-free shopping experience.`,
          },
          {
            title: "Buy Cloned Credit Cards UK - Clone Cards For Sale Online",
            content: "These cards are not ordinary copied card. In addition, it is a chip-written cards that has been golden clone and comes with PIN and is ready for use on any ATM. Also, it has no regional blocks and it can be useful anywhere in the world. In other words, buy clone card online and know each cloned card contains a balance ranging from $1000 to $100,000. Moreover, it is easy to use and after receiving your clone cards, all you have to do is wear face mask withdraw money from any ATM that accepts Visa and Mastercard. We ship Clone Credit Cards to the United States, Canada, United Kingdom, Australia and Europe.",
          },
          {
            title: "Advantages of Clone Credit Cards",
            content: "The advantage is your card details can be transferred onto a blank card  onto another card if broken or stolen. Also, these clone card can be use to make direct purchases and also obtain a cash. Buy Clone Card Online. Purchasing a cloned card or prepaid credit card is faster, easier, and less stressful for cashouts because you do not need to load your funds or use any technique to fill it! All you have to do is request a PCC/CCC (Prepaid Credit Card/Cloned Credit Card) with a large enough amount to cover the type of cashout you require because you don&#39;t want to use an ATM every day! Cash out at the store, ATM, or Bitcoin ATM!!! <br /> If you bought it from us, you have nothing to be afraid of while shopping with the CCC! However, if you buy elsewhere, I recommend that you use the ATM first before going to the store",
          },
          {
            title: "ORDER CLONE CARD ONLINE WORLDWIDE",
            content: "Buy Clone Card Online.Use our Clone Cards everywhere in the world. Travel with your card and pay internationally at reasonable prices. <br /> Take your physical card anywhere in the world. <br/>Withdraw money from any ATM around the world. With us you can buy Clone Cards that can be easily used. Our Clone Cards have been carefully made so much that you ca&#39;t differentiate it from the real Credit and Debit Cards",
          },
          {
            title: "BUY CLONE CARD ONLINE",
            content: "Welcome to the best world clone card online store. Clone cards are tools that allow you to protect your sensitive financial data when shopping online. They are virtual cards generated by advanced systems that replicate the information of your main credit or debit card, but with a different number. This means you can use a clone card to make online payments without having to directly expose your personal data. But why should you buy a clone card online from us? The answer is simple: we guarantee quality, safety, and reliability. Our service offers high-quality clone cards, created with cutting-edge technologies to ensure maximum security of your transactions. We make sure that every transaction is encrypted and protected from any cyber threats. Choosing to buy a clone card online from us means putting your financial security first. .Trust us and enjoy peace of mind while shopping on the web!",
          },
        ].map((section, index) => (
          <section key={index} className="mb-12">
            <h2 className="text-2xl font-bold text-elite-gold mb-4">
              {section.title}
            </h2>
            <p className="text-white leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>
      {/* Features Section */}
      <div className="bg-elite-surface/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Quality",
                description: "All products are verified for quality",
                icon: "🌟",
              },
              {
                title: "Fast Delivery",
                description: "Quick and secure worldwide shipping",
                icon: "🚀",
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock customer assistance",
                icon: "💬",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-elite-surface/50 backdrop-blur-sm p-6  border border-elite-border hover:border-elite-gold transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}






















