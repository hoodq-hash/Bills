"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/authentication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        login(data.userData, data.token);
        toast.success(data.message || "Login successful!");
        router.push("/admin");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-elite-bg">
      <header className="border-b border-white/10">
        <div className="zenith-container flex items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 border border-elite-gold/70 flex items-center justify-center bg-black/40">
              <span className="font-display font-light italic text-elite-gold text-lg leading-none">
                E
              </span>
            </div>
            <span className="font-display font-light italic text-elite-gold text-lg">
              Elite Notes
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <p className="section-eyebrow mb-4">Admin Access</p>
            <h1 className="font-display font-light italic text-3xl md:text-4xl text-white">
              Sign In
            </h1>
            <p className="mt-3 font-sans text-sm text-elite-muted">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <div className="admin-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted block mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-elite text-sm"
                  placeholder="Your username"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted block mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="input-elite text-sm pr-11"
                    placeholder="Your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-elite-muted hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 disabled:opacity-50"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-center mt-8">
            <Link
              href="/"
              className="font-sans text-[10px] uppercase tracking-[0.2em] text-elite-muted hover:text-elite-gold transition-colors"
            >
              Back to store
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
