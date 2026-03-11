import Link from "next/link";
import { cookies } from "next/headers";
import { LayoutDashboard, Users, FileStack, BarChart3, Mail } from "lucide-react";
import { createSsrClient } from "@/lib/supabase";
import { AdminSignOut } from "./AdminSignOut";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createSsrClient({
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options as { path?: string; maxAge?: number; httpOnly?: boolean; secure?: boolean; sameSite?: "lax" | "strict" | "none" })
        );
      } catch {
        // Ignored when called from Server Component during render
      }
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div dir="ltr" lang="en" className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div dir="ltr" lang="en" className="min-h-screen flex bg-background">
      <aside className="w-56 shrink-0 border-r border-navy/10 bg-white p-4 flex flex-col">
        <h2 className="font-bold text-navy mb-6">Beitlee Admin</h2>
        <nav className="flex flex-col gap-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-navy hover:bg-navy/5 font-medium"
          >
            <LayoutDashboard size={18} className="text-gold shrink-0" aria-hidden />
            Dashboard
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-navy hover:bg-navy/5"
          >
            <Users size={18} className="text-blue-600 shrink-0" aria-hidden />
            Leads
          </Link>
          <Link
            href="/admin/pages"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-navy hover:bg-navy/5"
          >
            <FileStack size={18} className="text-slate-600 shrink-0" aria-hidden />
            Pages (Phone / WhatsApp)
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-navy hover:bg-navy/5"
          >
            <BarChart3 size={18} className="text-emerald-600 shrink-0" aria-hidden />
            Analytics
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-navy/10">
          <p className="flex items-center gap-2 text-sm text-muted truncate px-3" title={user.email ?? ""}>
            <Mail size={14} className="text-sky-500 shrink-0" aria-hidden />
            {user.email}
          </p>
          <AdminSignOut />
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
