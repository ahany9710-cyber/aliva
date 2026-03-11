import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LogOut } from "lucide-react";
import { createSsrClient } from "@/lib/supabase";

export function AdminSignOut() {
  async function signOut() {
    "use server";
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
          // no-op
        }
      },
    });
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <form action={signOut} className="mt-2">
      <button
        type="submit"
        className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-muted hover:bg-navy/5 hover:text-navy text-left"
      >
        <LogOut size={16} className="text-rose-500 shrink-0" aria-hidden />
        Sign out
      </button>
    </form>
  );
}
