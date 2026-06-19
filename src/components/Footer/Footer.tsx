import Link from "next/link";
import {
  MapPinIcon,
  MailIcon,
  PhoneIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  GlobeIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-elite-surface to-elite-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-elite-gold/80">
                Stay updated with our latest bills and offers
              </p>
            </div>
            <div className="flex w-full md:w-auto sm:flex-row flex-col gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-elite-muted focus:outline-none focus:ring-2 focus:ring-elite-gold"
              />
              <button className="px-6 py-3 btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-elite-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display text-elite-gold">
                ELITE NOTES
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400 hover:text-elite-gold transition-colors">
                  <MapPinIcon className="w-5 h-5 flex-shrink-0" />
                  <p>Los Angeles, California, United States</p>
                </div>
                <div className="flex items-center gap-3 text-gray-400 hover:text-elite-gold transition-colors">
                  <MailIcon className="w-5 h-5 flex-shrink-0" />
                  <p>info@elitenotes.com</p>
                </div>
                <div className="flex items-center gap-3 text-gray-400 hover:text-elite-gold transition-colors">
                  <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                  <p>+1 (443) 312-9778</p>
                </div>
              </div>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-elite-gold text-gray-400 hover:text-white transition-colors"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-elite-gold text-gray-400 hover:text-white transition-colors"
                >
                  <TwitterIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-elite-gold text-gray-400 hover:text-white transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/5 hover:bg-elite-gold text-gray-400 hover:text-white transition-colors"
                >
                  <GlobeIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Our Category */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Our Category
              </h3>
              <ul className="space-y-4">
                {/* <li>
                  <Link
                    href="/clonedcards"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    Cloned Cards
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/eurobills"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    Euro Bills
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bills"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    USD Bills
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gbpbills"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    GBP Bills
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cadbills"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    CAD Bills
                  </Link>
                </li>
              </ul>
            </div>

            {/* Site Support */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/faq"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bills"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    Shop Bills
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reviews"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    Customer Reviews
                  </Link>
                </li>
              </ul>
            </div>

            {/* Our Policy */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">
                Our Policy
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/privacy"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    Shipping and Return
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="group flex items-center text-gray-400 hover:text-elite-gold transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    Terms and Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/90 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              Copyright © {new Date().getFullYear()} Elite Notes. All
              rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-400 hover:text-elite-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-400 hover:text-elite-gold transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
