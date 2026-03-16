import { NextResponse, type NextRequest } from "next/server";
import { createSsrClient } from "@/lib/supabase";
import { getAdminEmails } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createSsrClient({
    getAll() {
      return request.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as Record<string, unknown>);
      });
    },
  });

  // Refresh session so expired tokens are updated and cookies are written to the response.
  // In production, the browser can have a valid session while the server sees an expired token
  // until we run getSession(), which triggers refresh and setAll() to write new cookies.
  await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (!adminEmails.includes((user.email ?? "").toLowerCase())) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
