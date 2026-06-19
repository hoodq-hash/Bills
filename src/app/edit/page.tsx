"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Star, StarHalf, Sparkles, TrendingUp, Tag, ArrowDownWideNarrow } from 'lucide-react';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const products = [
  {
    id: 1,
    name: "Xbox Series X",
    price: 499.99,
    rating: 4,
    image: "/images/x-box2.jpeg",
    discount: 10,
    stock: 15,
  },
  {
    id: 2,
    name: "Samsung Laptop",
    price: 369.00,
    rating: 4,
    image: "/images/samsunglappi-1.jpg",
    discount: 15,
    stock: 8,
  },
  {
    id: 3,
    name: "PlayStation 5",
    price: 499.99,
    rating: 4.5,
    image: "/images/ps5-1.jpg",
    discount: 5,
    stock: 20,
  },
];

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-amber-400 text-amber-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-amber-400" />);
    }

    return stars;
  };

  const discountedPrice = product.price * (1 - product.discount / 100);

  return (
    <div
      className="group relative bg-gradient-to-b from-slate-800 to-elite-bg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-4 left-4 bg-elite-gold text-black px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-lg">
          -{product.discount}%
        </div>
      )}

      {/* Stock Badge */}
      <div className="absolute top-4 right-4 bg-elite-card/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-10">
        {product.stock} left
      </div>

      {/* Image Container */}
      <div className="relative aspect-square p-6 bg-gradient-to-br from-slate-700/20 to-elite-bg/20">
        <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-4">
        <h4 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {product.name}
        </h4>
        
        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-2xl font-bold text-elite-gold">
            ${discountedPrice.toFixed(2)}
          </p>
          {product.discount > 0 && (
            <p className="text-sm text-slate-400 line-through">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 mb-4">
          {renderStars(product.rating)}
          <span className="text-slate-400 text-sm ml-2">({product.rating})</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-elite-gold hover:bg-elite-gold-light text-black py-2.5 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-elite-gold focus:ring-offset-2 focus:ring-offset-elite-bg"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-elite-bg"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-elite-gold/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState("default");
  const [productList, setProductList] = useState(products);

  const handleSort = (event) => {
    const value = event.target.value;
    setSortBy(value);
    let sortedProducts = [...productList];

    switch (value) {
      case "price":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        sortedProducts.sort((a, b) => b.stock - a.stock);
        break;
      case "sale":
        sortedProducts.sort((a, b) => b.discount - a.discount);
        break;
      default:
        sortedProducts = [...products];
    }

    setProductList(sortedProducts);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 sm:mb-0">
            Featured Products
          </h2>
          <div className="relative">
            <select
              value={sortBy}
              onChange={handleSort}
              className="w-full sm:w-auto pl-4 pr-10 py-3 bg-elite-surface text-white border border-elite-border rounded-xl focus:outline-none focus:ring-2 focus:ring-elite-gold focus:border-transparent appearance-none"
            >
              <option value="default">Default sorting</option>
              <option value="price">Sort by price</option>
              <option value="rating">Sort by rating</option>
              <option value="popularity">Sort by popularity</option>
              <option value="sale">Sort by discount</option>
            </select>
            <ArrowDownWideNarrow className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productList.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={(product) => console.log("Edit:", product)}
              onDelete={(id) => setProductList(productList.filter(p => p.id !== id))}
            />
          ))}
        </div>
      </main>
      <Footer/>
    </div>
  );
}