"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, ShoppingCartIcon, XIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  variant?: "default" | "hero";
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/bills", label: "Bills" },
  { href: "/usdbills", label: "USD" },
  { href: "/eurobills", label: "EUR" },
  { href: "/gbpbills", label: "GBP" },
  { href: "/cadbills", label: "CAD" },
  { href: "/ascorbicacid", label: "Ascorbic Acid" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 border border-elite-gold/80 flex items-center justify-center bg-black/30 group-hover:border-elite-gold transition-colors">
        <span className="font-display font-light italic text-elite-gold text-xl leading-none">
          E
        </span>
      </div>
      <div className="hidden sm:block">
        <span className="block font-display font-light italic text-elite-gold text-lg leading-tight tracking-wide">
          Elite Notes
        </span>
        <span className="block font-sans text-[9px] tracking-[0.35em] uppercase text-white/50">
          Premium Since 2018
        </span>
      </div>
    </Link>
  );
}

export default function Navbar({ variant = "default" }: NavbarProps) {
  const isHero = variant === "hero";
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const cartCount = cartItems?.length || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/bills") return pathname === "/bills";
    return pathname.startsWith(href);
  };

  const headerBg =
    isHero && !scrolled
      ? "bg-black/30 backdrop-blur-[2px]"
      : "bg-black/90 backdrop-blur-md border-b border-white/10";

  return (
    <>
      <header
        className={`${isHero ? "fixed" : "sticky"} top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="zenith-container flex items-center justify-between gap-6 h-[4.25rem] md:h-[4.75rem]">
          <Logo />

          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link whitespace-nowrap ${
                  isActive(link.href) ? "nav-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-white/70 hover:text-elite-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingCartIcon className="w-[18px] h-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-elite-gold text-black text-[9px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="xl:hidden p-2 text-white/80"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-black/70 z-[60] xl:hidden transition-opacity ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[min(100%,18rem)] bg-[#0a0a0f] border-l border-white/10 z-[70] xl:hidden transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <span className="font-display font-light italic text-elite-gold text-lg">
            Menu
          </span>
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
            <XIcon className="w-5 h-5 text-white" strokeWidth={1.5} />
          </button>
        </div>
        <nav className="p-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 font-sans text-xs uppercase tracking-[0.15em] ${
                isActive(link.href) ? "text-elite-gold" : "text-white/75"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
