import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const projectSlug = request.nextUrl.searchParams.get("project_slug")?.trim() ?? null;

  const supabase = createServerClient();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (projectSlug) {
    query = query.eq("project_slug", projectSlug);
  }
  const { data, error } = await query;

  if (error) {
    console.error("Admin leads fetch error:", error);
    return NextResponse.json({ message: "Error fetching leads" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
