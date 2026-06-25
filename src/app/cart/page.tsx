"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  ChevronRight,
  CreditCard,
  ShoppingCart,
} from "lucide-react";
import Footer from "@/components/Footer/Footer";
import Logo from "@/components/Logo/Logo";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const CheckoutNav = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, name: "Cart", icon: ShoppingCart },
    { id: 2, name: "Checkout", icon: CreditCard },
    { id: 3, name: "Confirmation", icon: CheckCircle },
  ];

  return (
    <nav
      className="bg-elite-surface/50 border-b border-elite-border"
      aria-label="Checkout progress"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Logo size="sm" />
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <React.Fragment key={step.id}>
                  {index > 0 && (
                    <ChevronRight
                      className="w-4 h-4 text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "text-elite-gold"
                        : isPast
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-elite-gold"
                          : isPast
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center">
            <div className="flex items-center space-x-2 text-gray-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const CartItem = ({ item, updateItemQuantity, removeItem }) => (
  <div className="flex items-center gap-6 p-6 hover:bg-elite-surface/90 transition-all duration-300">
    <div className="relative w-24 h-24 flex-shrink-0 group">
      <Image
        src={item.image}
        fill
        className="object-cover text-gray-200 transform group-hover:scale-105 transition-transform duration-300"
        alt={item.title}
      />
    </div>
    <div className="flex-grow">
      <h3 className="font-medium text-white mb-1 hover:text-[#4682B4] transition-colors">
        {item.title}
      </h3>
      <p className="text-[#4682B4] font-semibold">${item.price}</p>
      <p className="text-gray-400">Amount: {item.selectedAmount} Euro</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-elite-border overflow-hidden bg-elite-surface/50 shadow-sm">
        <button
          onClick={() => updateItemQuantity(item._id, item.selectedAmount, Math.max(1, item.quantity - 1))}
          className="px-3 py-2 hover:bg-elite-surface/50 transition-colors border-r border-elite-border"
          aria-label="Decrease quantity"
        >
          <i className="fa-solid fa-minus text-gray-200"></i>
        </button>
        <span className="w-12 text-center font-medium text-gray-100">
          {item.quantity}
        </span>
        <button
          onClick={() => updateItemQuantity(item._id, item.selectedAmount, item.quantity + 1)}
          className="px-3 py-2 hover:bg-elite-surface/50 transition-colors border-l border-elite-border"
          aria-label="Increase quantity"
        >
          <i className="fa-solid fa-plus text-gray-200"></i>
        </button>
      </div>
      <button
        onClick={() => removeItem(item._id)}
        className="p-2 hover:bg-elite-surface/50 transition-all duration-300 group"
        aria-label="Remove item"
      >
        <i className="fa-solid fa-trash text-red-500 group-hover:text-red-600 transform group-hover:scale-110 transition-all"></i>
      </button>
    </div>
  </div>
);

const OrderSummary = ({
  subtotal,
  shipping,
  discount,
  total,
  promoCode,
  setPromoCode,
  applyPromoCode,
  promoError,
  checkout,
}) => (
  <div className="bg-elite-surface/50 rounded-xl shadow-md p-6">
    <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>

    <div className="space-y-4">
      <div className="flex justify-between text-gray-200">
        <span>Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-200">
        <span>Shipping</span>
        <span className="font-medium">${shipping.toFixed(2)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}
      <div className="border-t border-elite-border pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Total</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#084e94]">
              ${total.toFixed(2)}
            </span>
            <p className="text-sm text-gray-500">including VAT</p>
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="w-full px-4 py-3 border border-elite-border bg-elite-surface/50 text-white focus:outline-none focus:ring-2 focus:ring-[#4682B4] transition-all"
        />
        <button
          onClick={applyPromoCode}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 transition-colors"
        >
          Apply
        </button>
      </div>

      {promoError && (
        <p className="text-red-500 text-sm flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation"></i>
          {promoError}
        </p>
      )}
      {discount > 0 && (
        <p className="text-green-600 text-sm flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i>
          Promo code applied successfully!
        </p>
      )}

      <button
        onClick={checkout}
        className="w-full bg-[#0A2A4A] text-white py-4 hover:bg-[#4682B4] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg text-lg font-medium"
      >
        Proceed to Checkout
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <i className="fa-solid fa-lock"></i>
        <span>Secure checkout powered by Stripe</span>
      </div>
    </div>
  </div>
);

export default function CartPage() {
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [discount, setDiscount] = useState(0);
  const router = useRouter();
  
  const { 
    cartItems, 
    updateItemQuantity, 
    removeFromCart, 
    getTotalPrice 
  } = useCart();

  // If cartItems is undefined, show loading state
  if (!cartItems) {
    return (
      <>
        <CheckoutNav currentStep={1} />
        <div className="min-h-screen bg-elite-bg py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-gray-200">
              Loading cart...
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const shipping = 15.99;
  
  const subtotal = getTotalPrice();
  const total = subtotal + shipping - discount;

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setDiscount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-elite-bg">
      <CheckoutNav currentStep={1} />

      <main className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Shopping Cart
          </h1>
          <span className="px-4 py-2 bg-[#0A2A4A] text-white text-sm font-medium">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-elite-surface/50 rounded-xl shadow-md">
            <h2 className="text-2xl font-medium text-white mb-4">
              Your cart is empty
            </h2>
            <Link
              href="/"
              className="inline-block bg-[#0A2A4A] text-white px-8 py-3 hover:bg-[#4682B4] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-elite-surface/50 rounded-xl shadow-md overflow-hidden">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    updateItemQuantity={updateItemQuantity}
                    removeItem={(id) => removeFromCart(id, item.selectedAmount)}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                applyPromoCode={applyPromoCode}
                promoError={promoError}
                checkout={() => router.push("/checkout")}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
