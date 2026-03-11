"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, ArrowLeft, Shield } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={24} className="text-gold shrink-0" aria-hidden />
          <h1 className="text-xl font-bold text-navy">Admin</h1>
        </div>
        <p className="text-muted text-sm mb-6">Beitlee — Sign in</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="flex items-center gap-2 text-sm font-medium text-navy mb-1">
              <Mail size={16} className="text-sky-500 shrink-0" aria-hidden />
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="flex items-center gap-2 text-sm font-medium text-navy mb-1">
              <Lock size={16} className="text-amber-600 shrink-0" aria-hidden />
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gold text-white py-3 px-4 font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            <LogIn size={18} className="text-white shrink-0" aria-hidden />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-navy">
            <ArrowLeft size={14} className="shrink-0" aria-hidden />
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
