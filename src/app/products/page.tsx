"use client";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import React, { useEffect, useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

function Page({ params }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const { addToCart: addToCartContext } = useCart();

  const productId = params.id;

  const QUANTITY_OPTIONS = [
    { value: "3000", label: "3000 Euro" },
    { value: "5000", label: "5000 Euro" },
    { value: "10000", label: "10,000 Euro" },
    { value: "20000", label: "20,000 Euro" },
    { value: "40000", label: "40,000 Euro" },
    { value: "50000", label: "50,000 Euro" },
    { value: "70000", label: "70,000 Euro" },
    { value: "100000", label: "100,000 Euro" },
  ];

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/addProduct/${productId}`);

      if (!response.ok) {
        throw new Error(`Product not found`);
      }

      const data = await response.json();
      setSelectedProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const calculateDiscountedPrice = (selectedQuantity) => {
    const quantityValue = parseInt(selectedQuantity, 10);
    const discountPercentage = quantityValue === 100000 ? 0.09 : 0.10;
    const price = quantityValue * discountPercentage;
    return Number(price);
  };

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if (selectedValue) {
      setDiscountedPrice(calculateDiscountedPrice(selectedValue));
    } else {
      setDiscountedPrice(0);
    }
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedOption) {
      toast.error("Please select quantity before adding to cart");
      return;
    }

    try {
      const cartItem = {
        _id: selectedProduct._id,
        title: selectedProduct.title,
        image: selectedProduct.image,
        quantity: Number(quantity),
        selectedAmount: selectedOption,
        price: Number(discountedPrice),
      };

      addToCartContext(cartItem);
      toast.success(`Added ${quantity} x ${selectedProduct.title} to cart`);
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Cart error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-elite-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-elite-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-elite-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="text-center text-white">
            <h1 className="text-2xl">Product not found</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elite-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-3/5">
            <div className="relative aspect-square overflow-hidden shadow-lg">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          </div>

          <div className="w-full md:w-2/5 text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              {selectedProduct.title}
            </h1>

            <div className="space-y-4 md:space-y-6 text-base md:text-lg">
              <div className="grid gap-4 p-4 bg-elite-surface/50">
                <p><strong>Design:</strong> Undetectable banknotes</p>
                <p><strong>Currency:</strong> EUR</p>
                <p><strong>(MOQ):</strong> 3k (3,000)</p>
                <p><strong>Domestic Delivery:</strong> USA and Canada: 24 to 48 hours</p>
                <p><strong>International Delivery:</strong> 3 to 4 Business Days</p>
                <p className="font-semibold text-yellow-400">
                  Get 10% Discount for all Bitcoin Payment
                </p>
              </div>

              <div className="space-y-4 bg-elite-surface/50 p-4">
                <label htmlFor="quantity" className="block text-lg font-medium">
                  €10 Bills Quantity
                </label>
                <select
                  id="quantity"
                  className="w-full p-3 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-elite-gold focus:border-elite-gold"
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  <option value="">Choose an option</option>
                  {QUANTITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {selectedOption && (
                  <div className="text-xl font-bold text-elite-gold">
                    Price: ${discountedPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-elite-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-elite-card transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-elite-card transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={addToCart}
                    disabled={!selectedOption}
                    className={`flex-1 py-3 px-6 flex items-center justify-center gap-2 font-medium transition-all ${
                      selectedOption
                        ? "bg-elite-gold hover:bg-elite-gold text-black"
                        : "bg-elite-card text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;
