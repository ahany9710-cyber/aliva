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

  // Follow Supabase SSR pattern: setAll must update request.cookies so getUser()
  // reads refreshed tokens in the same middleware run, and recreate the response
  // with the updated request so Server Components receive the new cookies too.
  let response = NextResponse.next({ request });

  const supabase = createSsrClient({
    getAll() {
      return request.cookies.getAll().map((c) => ({ name: c.name, value: c.value }));
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as Record<string, unknown>);
      });
    },
  });

  // getSession() triggers token refresh if expired; refreshed cookies go to setAll above.
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
