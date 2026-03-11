import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { requireAdminSession } from "@/lib/admin-auth";
import { parsePeriod, getDateRangeForPeriod } from "@/lib/admin-period";

function escapeCsv(value: string | null | undefined): string {
  if (value == null) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(request: NextRequest) {
  const session = await requireAdminSession(request);
  if (session instanceof NextResponse) return session;

  const projectSlug = request.nextUrl.searchParams.get("project_slug")?.trim() ?? null;
  const period = parsePeriod(request.nextUrl.searchParams.get("period") ?? null);
  const { fromIso } = getDateRangeForPeriod(period);

  const supabase = createServerClient();
  let query = supabase
    .from("leads")
    .select("*")
    .gte("created_at", fromIso)
    .order("created_at", { ascending: false });
  if (projectSlug) {
    query = query.eq("project_slug", projectSlug);
  }
  const { data, error } = await query;

  if (error) {
    console.error("Admin leads export error:", error);
    return NextResponse.json({ message: "Error exporting leads" }, { status: 500 });
  }

  const rows = (data ?? []) as Array<{
    id: string;
    created_at: string;
    project_slug: string;
    name: string;
    phone: string;
    email: string | null;
    notes: string | null;
    source: string | null;
  }>;

  const header = "created_at,project_slug,name,phone,email,notes,source";
  const lines = rows.map(
    (r) =>
      [
        escapeCsv(r.created_at),
        escapeCsv(r.project_slug),
        escapeCsv(r.name),
        escapeCsv(r.phone),
        escapeCsv(r.email),
        escapeCsv(r.notes),
        escapeCsv(r.source),
      ].join(",")
  );
  const csv = [header, ...lines].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${projectSlug ?? "all"}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
