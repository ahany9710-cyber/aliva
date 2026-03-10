import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-56 shrink-0 border-r border-navy/10 bg-white p-4 flex flex-col">
        <h2 className="font-bold text-navy mb-6">Beitlee Admin</h2>
        <nav className="flex flex-col gap-1">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-navy hover:bg-navy/5 font-medium"
          >
            لوحة التحكم
          </Link>
          <Link
            href="/admin/leads"
            className="rounded-lg px-3 py-2 text-navy hover:bg-navy/5"
          >
            العملاء المحتملون
          </Link>
          <Link
            href="/admin/pages"
            className="rounded-lg px-3 py-2 text-navy hover:bg-navy/5"
          >
            الصفحات (هاتف / واتساب)
          </Link>
          <Link
            href="/admin/analytics"
            className="rounded-lg px-3 py-2 text-navy hover:bg-navy/5"
          >
            التحليلات
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-navy/10">
          <p className="text-sm text-muted truncate px-3" title={user.email ?? ""}>
            {user.email}
          </p>
          <AdminSignOut />
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
