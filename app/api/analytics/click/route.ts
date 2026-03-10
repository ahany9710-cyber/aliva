import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAllProjectSlugs } from "@/content/projects";

const ALLOWED_BUTTON_IDS = ["cta_whatsapp", "cta_call", "header_whatsapp", "lead_submit"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const projectSlug = typeof body.project_slug === "string" ? body.project_slug.trim() : "";
    const buttonId = typeof body.button_id === "string" ? body.button_id.trim() : "";

    const slugs = getAllProjectSlugs();
    if (!projectSlug || !slugs.includes(projectSlug)) {
      return NextResponse.json({ message: "Invalid project_slug" }, { status: 400 });
    }
    if (!buttonId || !ALLOWED_BUTTON_IDS.includes(buttonId)) {
      return NextResponse.json({ message: "Invalid button_id" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("button_clicks").insert({
      project_slug: projectSlug,
      button_id: buttonId,
    });

    if (error) {
      console.error("button_clicks insert error:", error);
      return NextResponse.json({ message: "Error recording click" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Analytics click API error:", e);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
