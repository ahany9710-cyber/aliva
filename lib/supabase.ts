import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient as createBrowserClientFromPackage, createServerClient as createSsrClientFromPackage } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

export type CookieStore = {
  getAll(): { name: string; value: string }[] | Promise<{ name: string; value: string }[]>;
  setAll?(cookies: { name: string; value: string; options?: Record<string, unknown> }[]): void | Promise<void>;
};

/**
 * SSR client for middleware and Server Components. Uses anon key so auth session works.
 * Pass a cookie store: in middleware use request cookies + response; in server use next/headers cookies().
 */
export function createSsrClient(cookieStore: CookieStore): SupabaseClient {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  return createSsrClientFromPackage(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookieStore.setAll?.(cookiesToSet);
      },
    },
  });
}

/**
 * Browser client (publishable key). Uses cookies so middleware and server can read the session.
 * Use in Client Components (e.g. admin login).
 */
export function createBrowserClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  return createBrowserClientFromPackage(supabaseUrl, supabasePublishableKey);
}

let serverClient: SupabaseClient | null = null;

/**
 * Server-only client (secret key). Singleton; use in API routes for lead insert and analytics.
 * Never expose this key to the client.
 */
export function createServerClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  }
  if (!serverClient) {
    serverClient = createClient(supabaseUrl, supabaseSecretKey);
  }
  return serverClient;
}
