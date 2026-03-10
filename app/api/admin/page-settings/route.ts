import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAllProjectSlugs } from "@/content/projects";

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const supabase = createServerClient();
  const { data, error } = await supabase.from("page_settings").select("*");

  if (error) {
    console.error("Admin page-settings fetch error:", error);
    return NextResponse.json({ message: "Error fetching settings" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function PATCH(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => ({}));
  const projectSlug = typeof body.project_slug === "string" ? body.project_slug.trim() : "";
  const slugs = getAllProjectSlugs();
  if (!projectSlug || !slugs.includes(projectSlug)) {
    return NextResponse.json({ message: "Invalid project_slug" }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone.trim() || null : null;
  const whatsappNumber = typeof body.whatsapp_number === "string" ? body.whatsapp_number.trim() || null : null;

  const supabase = createServerClient();
  const { error } = await supabase
    .from("page_settings")
    .upsert(
      {
        project_slug: projectSlug,
        phone,
        whatsapp_number: whatsappNumber,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "project_slug" }
    );

  if (error) {
    console.error("Admin page-settings upsert error:", error);
    return NextResponse.json({ message: "Error saving settings" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
