import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getAllProjectSlugs } from "@/content/projects";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const projectSlug = typeof body.project_slug === "string" ? body.project_slug.trim() : "";
    const slugs = getAllProjectSlugs();
    if (!projectSlug || !slugs.includes(projectSlug)) {
      return NextResponse.json({ message: "Invalid project_slug" }, { status: 400 });
    }

    const utmSource = typeof body.utm_source === "string" ? body.utm_source.trim() || null : null;
    const utmCampaign = typeof body.utm_campaign === "string" ? body.utm_campaign.trim() || null : null;
    const referrer = typeof body.referrer === "string" ? body.referrer.trim() || null : null;

    const supabase = createServerClient();
    const { error } = await supabase.from("page_visits").insert({
      project_slug: projectSlug,
      utm_source: utmSource,
      utm_campaign: utmCampaign,
      referrer,
    });

    if (error) {
      console.error("page_visits insert error:", error);
      return NextResponse.json({ message: "Error recording visit" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Analytics visit API error:", e);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
