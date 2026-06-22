import Link from "next/link";
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_DISPLAY } from "@/constants/site";

const footerLinks = {
  company: [
    { href: "/bills", label: "Bills" },
    { href: "/ascorbicacid", label: "Ascorbic Acid" },
    { href: "/reviews", label: "Reviews" },
    { href: "/faq", label: "FAQ" },
  ],
  currencies: [
    { href: "/usdbills", label: "USD Bills" },
    { href: "/eurobills", label: "Euro Bills" },
    { href: "/gbpbills", label: "GBP Bills" },
    { href: "/cadbills", label: "CAD Bills" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="zenith-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <p className="text-[10px] tracking-[0.35em] uppercase text-elite-gold/80 mb-2">
              Elite Notes
            </p>
            <h2 className="font-display text-2xl font-bold text-white tracking-wide mb-4">
              ELITE NOTES
            </h2>
            <p className="text-elite-muted text-sm leading-relaxed max-w-xs">
              Premium currency solutions and discreet worldwide delivery — trusted
              since 2018.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-elite-muted hover:text-elite-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-5">
              Currencies
            </h3>
            <ul className="space-y-3">
              {footerLinks.currencies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-elite-muted hover:text-elite-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-5">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-elite-muted">
              <li>
                <a
                  href={`mailto:${SITE_EMAIL}`}
                  className="hover:text-elite-gold transition-colors"
                >
                  {SITE_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE_PHONE}`}
                  className="hover:text-elite-gold transition-colors"
                >
                  {SITE_PHONE_DISPLAY}
                </a>
              </li>
            </ul>
            <ul className="mt-6 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-elite-muted hover:text-elite-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="zenith-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-elite-muted">
          <p>© {new Date().getFullYear()} Elite Notes. All rights reserved.</p>
          <p className="tracking-wide uppercase">
            Your Vision. Our Network. Your Success.
          </p>
        </div>
      </div>
    </footer>
  );
}
