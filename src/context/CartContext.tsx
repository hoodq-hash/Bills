"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartContextValue, CartItem } from "@/types";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart) as CartItem[]);
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: CartItem) => {
    setCartItems((prevItems) => {
      const processedProduct: CartItem = {
        ...product,
        price:
          typeof product.price === "string"
            ? parseFloat(String(product.price).replace(/[^0-9.-]+/g, ""))
            : Number(product.price) || 0,
        quantity: Number(product.quantity) || 1,
      };

      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item._id === processedProduct._id &&
          item.selectedAmount === processedProduct.selectedAmount
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += processedProduct.quantity;
        return updatedItems;
      }

      return [...prevItems, processedProduct];
    });
  };

  const removeFromCart = (productId: string, selectedAmount: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item._id === productId && item.selectedAmount === selectedAmount)
      )
    );
  };

  const updateItemQuantity = (
    productId: string,
    selectedAmount: string,
    newQuantity: number
  ) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId && item.selectedAmount === selectedAmount
          ? { ...item, quantity: Math.max(1, parseInt(String(newQuantity)) || 1) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(String(item.price).replace(/[^0-9.-]+/g, ""))
          : Number(item.price) || 0;

      const quantity = parseInt(String(item.quantity)) || 0;
      const itemTotal = price * quantity;

      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce(
      (total, item) => total + (parseInt(String(item.quantity)) || 0),
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        getTotalPrice,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
