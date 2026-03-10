import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const EGYPT_PHONE_REGEX = /^(\+20|0)?1[0-2,5]{1}[0-9]{8}$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_slug,
      name,
      phone,
      email,
      notes,
      source,
    } = body as {
      project_slug?: string;
      name?: string;
      phone?: string;
      email?: string;
      notes?: string;
      source?: string;
    };

    if (!project_slug || typeof project_slug !== "string" || !project_slug.trim()) {
      return NextResponse.json(
        { message: "project_slug is required" },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { message: "الاسم مطلوب" },
        { status: 400 }
      );
    }
    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { message: "رقم الهاتف مطلوب" },
        { status: 400 }
      );
    }
    const normalizedPhone = phone.replace(/\s/g, "");
    if (!EGYPT_PHONE_REGEX.test(normalizedPhone)) {
      return NextResponse.json(
        { message: "رقم هاتف مصري صحيح مطلوب" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("leads").insert({
      project_slug: project_slug.trim(),
      name: name.trim(),
      phone: normalizedPhone,
      email: typeof email === "string" && email.trim() ? email.trim() : null,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      source: typeof source === "string" && source.trim() ? source.trim() : null,
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
