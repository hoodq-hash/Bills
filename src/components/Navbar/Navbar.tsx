import { useState, useEffect } from "react";
import {
  SearchIcon,
  ShoppingCartIcon,
  MenuIcon,
  XIcon,
  HomeIcon,
  PackageIcon,
  // CreditCardIcon,
  DollarSignIcon,
  EuroIcon,
  PoundSterlingIcon,
  StarIcon,
  // UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  variant?: "default" | "hero";
}

export default function Navbar({
  searchQuery = "",
  onSearchChange = () => {},
  variant = "default",
}: NavbarProps) {
  const isHero = variant === "hero";
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { cartItems } = useCart(); // Change this line
  const cartCount = cartItems?.length || 0; 

  const isLinkActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href === "/bills") return pathname === "/bills";
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Only apply scroll effect on desktop
      if (window.innerWidth >= 768) {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 400);
      }
    };

    // Initial check for screen size
    if (window.innerWidth < 768) {
      setIsScrolled(false);
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsScrolled(false);
      } else {
        handleScroll();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/", icon: <HomeIcon className="w-4 h-4" />, label: "Home" },
    {
      href: "/bills",
      icon: <PackageIcon className="w-4 h-4" />,
      label: "Bills",
    },
    // {
    //   href: "/clonedcards",
    //   icon: <CreditCardIcon className="w-4 h-4" />,
    //   label: "Cloned Cards",
    // },
    {
      href: "/eurobills",
      icon: <EuroIcon className="w-4 h-4" />,
      label: "EUR",
    },
    {
      href: "/usdbills",
      icon: <DollarSignIcon className="w-4 h-4" />,
      label: "USD",
    },
    {
      href: "/cadbills",
      icon: <DollarSignIcon className="w-4 h-4" />,
      label: "CAD",
    },
    {
      href: "/gbpbills",
      icon: <PoundSterlingIcon className="w-4 h-4" />,
      label: "GBP",
    },
    {
      href: "/reviews",
      icon: <StarIcon className="w-4 h-4" />,
      label: "Reviews",
    },
  ];

  return (
    <>
      <div
        className={`w-full ${
          isHero
            ? "relative z-40"
            : isScrolled
              ? "fixed top-0 left-0 transform translate-y-0 transition-transform duration-300 z-50 shadow-2xl"
              : "relative"
        }`}
      >
        {/* Top Bar with Announcement - hidden on hero homepage */}
        {!isScrolled && !isHero && (
          <div className="bg-elite-surface border-b border-elite-gold/20 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center">
                <p className="text-xs font-medium tracking-wide text-elite-gold">
                  <span className="hidden md:inline">
                    🔥 Elite Notes — Premium Bills Service Since 2018
                  </span>
                  <span className="md:hidden">🔥 Elite Notes</span>
                </p>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <div
          className={
            isHero
              ? "bg-black/40 backdrop-blur-md border-b border-white/10"
              : "bg-elite-bg border-b border-elite-border"
          }
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 group">
                <span className="text-2xl font-bold font-display tracking-wide text-elite-gold group-hover:text-elite-gold-light transition-all duration-300">
                  ELITE NOTES
                </span>
              </Link>

              {/* Desktop Search Bar */}
              <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                <div className="relative w-full group">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 pl-12 rounded-xl bg-elite-surface/50 border border-elite-border/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-elite-gold focus:border-transparent transition-all duration-300 group-hover:bg-elite-surface/70"
                    placeholder="Search bills..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                  <SearchIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/cart"
                  className="relative p-2 rounded-full hover:bg-elite-surface transition-colors duration-300 group"
                >
                  <ShoppingCartIcon className="h-6 w-6 text-gray-300 group-hover:text-elite-gold" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-elite-gold text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-elite-surface transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <XIcon className="h-6 w-6 text-gray-300" />
                ) : (
                  <MenuIcon className="h-6 w-6 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <div
          className={`hidden md:block backdrop-blur-sm border-b ${
            isHero
              ? "bg-black/30 border-white/10"
              : "bg-elite-surface/95 border-elite-border/50"
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-4 text-sm transition-all duration-300 relative group
                    ${
                      isActive
                        ? "text-elite-gold bg-elite-card/30"
                        : "text-gray-300 hover:text-elite-gold hover:bg-elite-card/30"
                    }
                  `}
                >
                  <span className={`${isActive ? "text-elite-gold" : ""}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  <div
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-elite-gold transition-transform duration-300
                      ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }
                    `}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/50 md:hidden backdrop-blur-sm transition-opacity duration-300 z-50 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <div
        className={`fixed inset-y-0 right-0 w-80 bg-elite-bg overflow-y-auto transition-transform duration-300 ease-in-out md:hidden shadow-xl z-50 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Mobile Search */}
          <div className="relative mb-6">
            <input
              type="text"
              className="w-full px-4 py-3 pl-12 rounded-xl bg-elite-surface/50 border border-elite-border/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-elite-gold focus:border-transparent transition-all duration-300"
              placeholder="Search bills..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Mobile Cart Info */}
          <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-elite-surface/50 border border-elite-border/50">
            <div className="flex items-center gap-4">
              <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
              {cartCount > 0 && (
                <span className="text-gray-300">{cartCount} items</span>
              )}
            </div>
            <Link
              href="/cart"
              className="px-4 py-2 bg-elite-gold text-black rounded-lg hover:bg-elite-gold-light transition-colors duration-300 flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              View Cart
            </Link>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
                    ${
                      isActive
                        ? "text-elite-gold bg-elite-surface"
                        : "text-gray-300 hover:bg-elite-surface"
                    }
                  `}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={`${isActive ? "text-elite-gold" : ""}`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Footer — removed support/contact links */}
        </div>
      </div>
    </>
  );
}
