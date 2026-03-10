import { NextRequest, NextResponse } from "next/server";
import { createSsrClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = getAdminEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.toLowerCase());
}

/**
 * Get Supabase cookie store from Next.js request (for API routes).
 */
function cookieStoreFromRequest(request: NextRequest) {
  return {
    getAll() {
      return request.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
    },
    setAll: undefined,
  };
}

export type AdminSession = { user: User };

/**
 * In API routes: ensure the request has a valid admin session.
 * Returns { user } or a 401/403 NextResponse.
 */
export async function requireAdminSession(
  request: NextRequest
): Promise<AdminSession | NextResponse> {
  const supabase = createSsrClient(cookieStoreFromRequest(request));
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin(user.email ?? undefined)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return { user };
}

/**
 * Get current user from request cookies if present. Does not check admin allowlist.
 * Use in admin layout to show email; protection is done in middleware + requireAdminSession.
 */
export async function getSessionUser(request: NextRequest): Promise<User | null> {
  const supabase = createSsrClient(cookieStoreFromRequest(request));
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export { isAdmin, getAdminEmails };
