import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
        className="w-full rounded-lg px-3 py-2 text-sm text-muted hover:bg-navy/5 hover:text-navy text-right"
      >
        تسجيل الخروج
      </button>
    </form>
  );
}
