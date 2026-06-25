"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartPanelProps {
  variant: "desktop" | "mobile";
}

export default function CartPanel({ variant }: CartPanelProps) {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateItemQuantity,
    getTotalPrice,
    getCartItemsCount,
  } = useCart();

  const isDesktop = variant === "desktop";
  const itemCount = getCartItemsCount();
  const subtotal = getTotalPrice();
  const shipping = cartItems.length > 0 ? 15.99 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!isCartOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const panelContent = (
    <>
      <div
        className={`flex items-center justify-between border-b border-white/10 ${
          isDesktop ? "px-6 py-5" : "px-5 py-4"
        }`}
      >
        <div>
          <p className="section-eyebrow mb-1">Your Cart</p>
          <h2 className="font-display font-light italic text-xl text-white">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </h2>
        </div>
        <button
          type="button"
          onClick={closeCart}
          className="p-2 text-white/50 hover:text-white transition-colors"
          aria-label="Close cart"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div
        className={`overflow-y-auto ${
          isDesktop ? "max-h-[min(36rem,70vh)] px-6 py-4" : "flex-1 px-4 py-4"
        }`}
      >
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-10 h-10 text-elite-muted/40 mx-auto mb-4" />
            <p className="font-sans text-sm text-elite-muted mb-6">Your cart is empty</p>
            <Link href="/bills" onClick={closeCart} className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={`${item._id}-${item.selectedAmount}`}
                className="flex gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0"
              >
                <div className="relative w-20 h-20 shrink-0 bg-black/40 border border-white/10 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-elite-muted/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-white line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  {item.selectedAmount && (
                    <p className="font-sans text-[10px] uppercase tracking-wider text-elite-muted mt-1">
                      Qty: {item.selectedAmount}
                    </p>
                  )}
                  <p className="font-display font-light italic text-elite-gold mt-1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-white/15">
                      <button
                        type="button"
                        onClick={() =>
                          updateItemQuantity(
                            item._id,
                            item.selectedAmount,
                            item.quantity - 1
                          )
                        }
                        className="p-1.5 text-white/60 hover:text-elite-gold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-sans text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateItemQuantity(
                            item._id,
                            item.selectedAmount,
                            item.quantity + 1
                          )
                        }
                        className="p-1.5 text-white/60 hover:text-elite-gold transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id, item.selectedAmount)}
                      className="p-1.5 text-red-400/70 hover:text-red-400 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {cartItems.length > 0 && (
        <div
          className={`border-t border-white/10 bg-black/40 ${
            isDesktop ? "px-6 py-5" : "px-5 py-5 pb-8"
          }`}
        >
          <div className="space-y-2 text-sm font-sans mb-5">
            <div className="flex justify-between text-white/70">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-medium pt-2 border-t border-white/10">
              <span>Total</span>
              <span className="font-display font-light italic text-xl text-elite-gold">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
              className="btn-primary w-full py-3.5"
            >
              Checkout
            </button>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-secondary w-full py-3 text-center"
            >
              View Full Cart
            </Link>
          </div>
        </div>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <>
        <div
          className="fixed inset-0 z-[55] hidden md:block"
          onClick={closeCart}
          aria-hidden
        />
        <div className="absolute right-0 top-full mt-3 z-[60] hidden md:block w-[min(calc(100vw-2rem),34rem)] bg-[#0a0a0f] border border-white/10 shadow-2xl shadow-black/50">
          {panelContent}
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-[80] md:hidden"
        onClick={closeCart}
        aria-hidden
      />
      <div className="fixed inset-x-0 bottom-0 z-[85] md:hidden max-h-[88vh] flex flex-col bg-[#0a0a0f] border-t border-white/10">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        {panelContent}
      </div>
    </>
  );
}
