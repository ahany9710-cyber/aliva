import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { isValidEgyptPhone, normalizeEgyptPhone } from "@/lib/validation";
import type { LeadFormPayload } from "@/types/lead";

function parseBody(body: unknown): LeadFormPayload | null {
  if (body == null || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const project_slug = typeof o.project_slug === "string" ? o.project_slug.trim() : "";
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const phone = typeof o.phone === "string" ? o.phone : "";
  if (!project_slug || !name || !phone) return null;
  return {
    project_slug,
    name,
    phone,
    email: typeof o.email === "string" && o.email.trim() ? o.email.trim() : undefined,
    notes: typeof o.notes === "string" && o.notes.trim() ? o.notes.trim() : undefined,
    source: typeof o.source === "string" && o.source.trim() ? o.source.trim() : undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = parseBody(body);
    if (!payload) {
      return NextResponse.json({ message: "project_slug is required" }, { status: 400 });
    }
    if (!payload.name) {
      return NextResponse.json({ message: "الاسم مطلوب" }, { status: 400 });
    }
    if (!isValidEgyptPhone(payload.phone)) {
      return NextResponse.json(
        { message: "رقم هاتف صحيح مطلوب (مصر، السعودية، البحرين، الإمارات، قطر)" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeEgyptPhone(payload.phone);
    const supabase = createServerClient();
    const { error } = await supabase.from("leads").insert({
      project_slug: payload.project_slug,
      name: payload.name,
      phone: normalizedPhone,
      email: payload.email ?? null,
      notes: payload.notes ?? null,
      source: payload.source ?? null,
    });

    if (error) {
      console.error("Supabase leads insert error:", error);
      return NextResponse.json(
        { message: "حدث خطأ أثناء حفظ البيانات، يرجى المحاولة لاحقاً" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Leads API error:", e);
    return NextResponse.json(
      { message: "حدث خطأ، يرجى المحاولة لاحقاً" },
      { status: 500 }
    );
  }
}
