"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function NotFound() {
  useEffect(() => {
    console.log("404 page visited");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <main className="flex-grow flex items-center justify-center px-4 py-12 mt-16">
        <div className="max-w-3xl w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-slate-400/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
            <h1 className="text-[150px] md:text-[200px] font-bold text-slate-800/10 leading-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                Page Not Found
              </h2>
            </div>
          </div>

          {/* Message */}
          <div className="mb-12 space-y-4">
            <p className="text-lg text-slate-300">
              Oops! The page you're looking for seems to have vanished into thin
              air.
            </p>
            <p className="text-slate-400">
              Don't worry, even the best of us get lost sometimes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-elite-surface text-slate-200 rounded-lg hover:bg-elite-card transition-colors duration-200 border border-elite-border"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <Link
                href="/bills"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-elite-border text-slate-200 rounded-lg hover:bg-elite-surface transition-colors duration-200"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Bills
              </Link>
            </div>

            {/* Previous Page Button */}
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-16">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Popular Destinations
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { href: "/bills", label: "Bills" },
                { href: "/faq", label: "FAQ" },
                { href: "/reviews", label: "Reviews" },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 bg-elite-bg/50 text-slate-300 rounded-full hover:bg-elite-surface border border-elite-border/50 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-elite-bg rounded-full opacity-20 blur-3xl"
          style={{
            transform: "translate(30%, -30%)",
            animation: "float 8s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-900 via-slate-800 to-elite-bg rounded-full opacity-20 blur-3xl"
          style={{
            transform: "translate(-30%, 30%)",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        ></div>
      </div>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(30%, -30%);
          }
          50% {
            transform: translate(25%, -35%);
          }
        }
      `}</style>
    </div>
  );
}
