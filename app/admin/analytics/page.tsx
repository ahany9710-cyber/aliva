import { Suspense } from "react";
import { BarChart3, Eye, MousePointerClick, MessageCircle, Phone, LayoutPanelTop, Send } from "lucide-react";
import { createServerClient } from "@/lib/supabase";
import { parsePeriod, getDateRangeForPeriod, getPeriodLabel } from "@/lib/admin-period";
import { PeriodSelector } from "../PeriodSelector";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminAnalyticsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = parsePeriod(params.period ?? null);
  const { fromIso } = getDateRangeForPeriod(period);
  const periodLabel = getPeriodLabel(period);

  const supabase = createServerClient();

  const { data: visitsData } = await supabase
    .from("page_visits")
    .select("project_slug, visited_at")
    .gte("visited_at", fromIso);

  const { data: clicksData } = await supabase
    .from("button_clicks")
    .select("project_slug, button_id")
    .gte("clicked_at", fromIso);

  const visitsBySlugAndDay: Record<string, Record<string, number>> = {};
  (visitsData ?? []).forEach((row: { project_slug: string; visited_at: string }) => {
    const day = row.visited_at.slice(0, 10);
    if (!visitsBySlugAndDay[row.project_slug]) visitsBySlugAndDay[row.project_slug] = {};
    visitsBySlugAndDay[row.project_slug][day] = (visitsBySlugAndDay[row.project_slug][day] ?? 0) + 1;
  });

  const clicksBySlugAndButton: Record<string, Record<string, number>> = {};
  (clicksData ?? []).forEach((row: { project_slug: string; button_id: string }) => {
    if (!clicksBySlugAndButton[row.project_slug]) clicksBySlugAndButton[row.project_slug] = {};
    clicksBySlugAndButton[row.project_slug][row.button_id] =
      (clicksBySlugAndButton[row.project_slug][row.button_id] ?? 0) + 1;
  });

  const slugOrder = Array.from(
    new Set([
      ...Object.keys(visitsBySlugAndDay),
      ...Object.keys(clicksBySlugAndButton),
    ])
  ).sort();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-navy">
          <BarChart3 size={28} className="text-emerald-600 shrink-0" aria-hidden />
          Analytics
        </h1>
        <Suspense fallback={<div className="h-9 w-32 rounded-lg bg-navy/10 animate-pulse" />}>
          <PeriodSelector />
        </Suspense>
      </div>
      <p className="text-muted text-sm mb-6">{periodLabel} — page visits and button clicks.</p>

      <section className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy mb-4">
          <Eye size={20} className="text-sky-500 shrink-0" aria-hidden />
          Page visits (by day)
        </h2>
        <div className="rounded-xl border border-navy/10 bg-white overflow-x-auto">
          <table className="w-full text-left min-w-[400px]">
            <thead className="bg-navy/5 border-b border-navy/10">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Project</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Count</th>
              </tr>
            </thead>
            <tbody>
              {slugOrder.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted">
                    No visits yet.
                  </td>
                </tr>
              ) : (
                slugOrder.flatMap((slug) => {
                  const days = visitsBySlugAndDay[slug];
                  if (!days) return [];
                  return Object.entries(days)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([day, count]) => (
                      <tr key={`${slug}-${day}`} className="border-b border-navy/5">
                        <td className="px-4 py-2 text-sm text-navy">{slug}</td>
                        <td className="px-4 py-2 text-sm text-navy">{day}</td>
                        <td className="px-4 py-2 text-sm text-navy">{count}</td>
                      </tr>
                    ));
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-navy mb-4">
          <MousePointerClick size={20} className="text-violet-500 shrink-0" aria-hidden />
          Button clicks (by project and type)
        </h2>
        <div className="rounded-xl border border-navy/10 bg-white overflow-x-auto">
          <table className="w-full text-left min-w-[400px]">
            <thead className="bg-navy/5 border-b border-navy/10">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-navy">Project</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">
                  <span className="inline-flex items-center gap-1"><MessageCircle size={14} className="text-green-500 shrink-0" aria-hidden /> WhatsApp (sticky)</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">
                  <span className="inline-flex items-center gap-1"><Phone size={14} className="text-blue-500 shrink-0" aria-hidden /> Call</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">
                  <span className="inline-flex items-center gap-1"><LayoutPanelTop size={14} className="text-slate-500 shrink-0" aria-hidden /> WhatsApp (header)</span>
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">
                  <span className="inline-flex items-center gap-1"><Send size={14} className="text-amber-500 shrink-0" aria-hidden /> Form submit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {slugOrder.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No clicks yet.
                  </td>
                </tr>
              ) : (
                slugOrder.map((slug) => {
                  const buttons = clicksBySlugAndButton[slug] ?? {};
                  return (
                    <tr key={slug} className="border-b border-navy/5">
                      <td className="px-4 py-2 text-sm font-medium text-navy">{slug}</td>
                      <td className="px-4 py-2 text-sm text-navy">{buttons.cta_whatsapp ?? 0}</td>
                      <td className="px-4 py-2 text-sm text-navy">{buttons.cta_call ?? 0}</td>
                      <td className="px-4 py-2 text-sm text-navy">{buttons.header_whatsapp ?? 0}</td>
                      <td className="px-4 py-2 text-sm text-navy">{buttons.lead_submit ?? 0}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
