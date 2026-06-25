"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import HeroSlider from "@/components/zenith/HeroSlider";
import SectionHeading from "@/components/zenith/SectionHeading";
import CountUpStat from "@/components/zenith/CountUpStat";
import type { Product } from "@/types";
import { SHOP_CATEGORIES } from "@/constants/catalog";

const stats = [
  { value: 10, suffix: "K+", label: "Orders Fulfilled" },
  { value: 50, suffix: "+", label: "Premium Products" },
  { value: 40, suffix: "+", label: "Countries Served" },
  { value: 8, suffix: "+", label: "Years of Excellence" },
];

const services = [
  {
    title: "Premium Bills",
    description:
      "High-quality undetectable bills in USD, EUR, GBP, and CAD — crafted to pass standard checks and look genuine in hand.",
    backgroundImage: "/images/premium-bills-bg.jpg",
  },
  {
    title: "Discreet Delivery",
    description:
      "Every order ships with 100% confidential packaging and tracked delivery options worldwide.",
    backgroundImage: "/images/discreet-delivery-bg.jpg",
  },
  {
    title: "Ascorbic Acid",
    description:
      "Lab-grade and commercial ascorbic acid products available through our curated catalog with fast fulfillment.",
    backgroundImage: "/acid/WhatsApp Image 2026-06-25 at 11.42.48 AM.jpeg",
  },
  {
    title: "Long-Term Trust",
    description:
      "Trusted since 2018 — we build enduring relationships with clients who value quality, discretion, and reliability.",
    backgroundImage: "/images/trust-bg.webp",
  },
];

const markets = [
  {
    region: "United States",
    detail: "USD bills — nationwide discreet shipping",
    backgroundImage: "/usd/WhatsApp Image 2026-06-25 at 11.44.00 AM.jpeg",
    href: "/usdbills",
  },
  {
    region: "European Union",
    detail: "Euro bills — EU & UK corridors",
    backgroundImage: "/euro/WhatsApp Image 2026-06-25 at 11.43.43 AM.jpeg",
    href: "/eurobills",
  },
  {
    region: "United Kingdom",
    detail: "GBP bills — premium sterling notes",
    backgroundImage: "/pounds/WhatsApp Image 2026-06-25 at 11.43.15 AM.jpeg",
    href: "/gbpbills",
  },
  {
    region: "Canada",
    detail: "CAD bills — fast North American delivery",
    backgroundImage: "/usd/WhatsApp Image 2026-06-25 at 11.43.58 AM.jpeg",
    href: "/cadbills",
  },
];

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 zenith-card">
        <p className="text-elite-muted">No products listed yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          href={`/products/${product._id}`}
          className="group zenith-card overflow-hidden p-0"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            {product.image && (
              <Image
                src={product.image}
                alt={product.title}
                fill
                quality={95}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute top-3 right-3 bg-elite-gold text-black text-xs font-bold px-2 py-1">
              {product.currency} {product.price}
            </div>
          </div>
          <div className="p-5">
            <p className="text-[10px] uppercase tracking-widest text-elite-gold mb-2">
              {product.category}
            </p>
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
              {product.title}
            </h3>
            <span className="flex items-center justify-center gap-2 w-full py-2.5 bg-elite-gold/10 border border-elite-gold/30 text-elite-gold text-xs uppercase tracking-wider group-hover:bg-elite-gold group-hover:text-black transition-colors">
              <ShoppingCart className="w-4 h-4" />
              Shop Now
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/addProduct")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Product[]) =>
        setProducts(
          data.filter((p) =>
            SHOP_CATEGORIES.some(
              (cat) => cat.toLowerCase() === p.category?.toLowerCase()
            )
          )
        )
      )
      .catch(() => {});
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-elite-bg">
      <Navbar variant="hero" />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 md:pt-32 pb-24">
        <HeroSlider />

        <div className="relative z-10 zenith-container text-center max-w-4xl px-4">
          <p className="section-eyebrow mb-10 md:mb-12">
            Your Vision. Our Network. Your Success.
          </p>

          <h1 className="hero-title mb-10 md:mb-12">
            <span className="block text-white">Where Capital</span>
            <span className="block text-elite-gold">Meets Ambition</span>
          </h1>

          <div className="inline-block bg-black/55 backdrop-blur-[2px] border border-white/10 px-8 sm:px-12 py-6 mb-12 max-w-2xl mx-auto">
            <p className="hero-body">
              Elite Notes — premium currency solutions and discreet worldwide
              delivery, trusted since 2018.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link href="/bills" className="btn-primary w-full sm:w-auto min-w-[220px]">
              Start Shopping
            </Link>
            <Link href="/ascorbicacid" className="btn-secondary w-full sm:w-auto min-w-[220px]">
              Explore Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-elite-surface/30">
        <div className="zenith-container py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <CountUpStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="zenith-section">
        <div className="zenith-container">
          <SectionHeading
            eyebrow="What We Do"
            title="Strategic Currency"
            highlight="Solutions"
            subtitle="We don't just supply products — we deliver discreet, premium-grade currency and chemical solutions trusted by clients worldwide."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const hasBg = "backgroundImage" in service && service.backgroundImage;

              if (hasBg) {
                return (
                  <div
                    key={service.title}
                    className="relative overflow-hidden border border-elite-border/80 min-h-[220px]"
                  >
                    <Image
                      src={encodeURI(service.backgroundImage)}
                      alt=""
                      fill
                      quality={95}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      aria-hidden
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                    <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                      <h3 className="font-display font-light italic text-xl text-white mb-3">
                        {service.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={service.title} className="zenith-card">
                  <h3 className="font-display text-xl text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-elite-muted text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Reach */}
      <section className="zenith-section bg-elite-surface/20 border-y border-white/5">
        <div className="zenith-container">
          <SectionHeading
            eyebrow="Our Reach"
            title="Active in the World's"
            highlight="Key Markets"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {markets.map((market) => (
              <Link
                key={market.region}
                href={market.href}
                className="group relative overflow-hidden border border-elite-border/80 min-h-[260px] block"
              >
                <Image
                  src={encodeURI(market.backgroundImage)}
                  alt={market.region}
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15 group-hover:from-black/70 transition-colors" />
                <div className="relative z-10 p-6 h-full flex flex-col justify-end text-center sm:text-left">
                  <h4 className="font-display font-light italic text-xl text-white mb-2">
                    {market.region}
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed">{market.detail}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="zenith-section">
        <div className="zenith-container">
          <SectionHeading
            eyebrow="Featured"
            title="Premium"
            highlight="Products"
            subtitle="Browse our latest bills and ascorbic acid listings."
          />
          <ProductGrid products={featured} />
          {products.length > 4 && (
            <div className="text-center mt-10">
              <Link href="/bills" className="btn-ghost-gold inline-flex gap-2">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Who We Are */}
      <section className="zenith-section bg-elite-surface/20 border-y border-white/5">
        <div className="zenith-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                eyebrow="Who We Are"
                title="Built on Trust,"
                highlight="Driven by Quality"
                align="left"
              />
              <p className="text-elite-muted leading-relaxed mb-6">
                Elite Notes was founded on a singular conviction: that premium
                currency solutions demand more than a transaction — they demand
                discretion, consistency, and a partner you can rely on.
              </p>
              <p className="text-elite-muted leading-relaxed mb-8">
                With a global footprint and deep expertise across multiple
                currencies, our team delivers quality where it matters most.
              </p>
              <Link href="/bills" className="btn-primary">
                Shop With Us
              </Link>
            </div>
            <blockquote className="zenith-card border-l-4 border-l-elite-gold">
              <p className="font-display text-xl md:text-2xl text-white/90 italic leading-relaxed mb-6">
                &ldquo;We don&apos;t just supply currency. We supply confidence
                in every order.&rdquo;
              </p>
              <footer className="text-elite-gold text-sm tracking-widest uppercase">
                — Elite Notes
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="zenith-section">
        <div className="zenith-container max-w-3xl text-center">
          <SectionHeading
            eyebrow="Get Started"
            title="Ready to"
            highlight="Order?"
            subtitle="Browse our full catalog of premium bills and ascorbic acid products — discreet shipping worldwide."
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/bills" className="btn-primary">
              Browse Bills
            </Link>
            <Link href="/reviews" className="btn-secondary">
              Read Reviews
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
