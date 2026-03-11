import { Suspense } from "react";
import { Users, Download, CalendarDays } from "lucide-react";
import { createServerClient } from "@/lib/supabase";
import { parsePeriod, getDateRangeForPeriod, getPeriodLabel } from "@/lib/admin-period";
import { PeriodSelector } from "../PeriodSelector";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = parsePeriod(params.period ?? null);
  const { fromIso } = getDateRangeForPeriod(period);
  const periodLabel = getPeriodLabel(period);

  const supabase = createServerClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .gte("created_at", fromIso)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-navy mb-6">
          <Users size={28} className="text-blue-600 shrink-0" aria-hidden />
          Leads
        </h1>
        <p className="text-red-600">Error loading data.</p>
      </div>
    );
  }

  const rows = (leads ?? []) as Array<{
    id: string;
    created_at: string;
    project_slug: string;
    name: string;
    phone: string;
    email: string | null;
    notes: string | null;
    source: string | null;
  }>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-navy">
          <Users size={28} className="text-blue-600 shrink-0" aria-hidden />
          Leads
        </h1>
        <div className="flex items-center gap-4">
          <Suspense fallback={<div className="h-9 w-32 rounded-lg bg-navy/10 animate-pulse" />}>
            <PeriodSelector />
          </Suspense>
          <a
            href={`/api/admin/leads/export?period=${period}`}
            className="flex items-center gap-2 rounded-xl bg-gold text-white px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            <Download size={18} className="text-white shrink-0" aria-hidden />
            Export CSV
          </a>
        </div>
      </div>
      <p className="flex items-center gap-2 text-muted text-sm mb-4">
        <CalendarDays size={14} className="text-amber-600 shrink-0" aria-hidden />
        Showing leads from {periodLabel.toLowerCase()}.
      </p>
      <div className="rounded-xl border border-navy/10 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-navy/5 border-b border-navy/10">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Project</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Phone</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No data yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-navy/5 hover:bg-navy/[0.02]">
                    <td className="px-4 py-3 text-sm text-navy">
                      {new Date(r.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3 text-sm text-navy">{r.project_slug}</td>
                    <td className="px-4 py-3 text-sm text-navy">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-navy">{r.phone}</td>
                    <td className="px-4 py-3 text-sm text-muted">{r.source ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
