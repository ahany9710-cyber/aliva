import { Suspense } from "react";
import { LayoutDashboard, Users, UserPlus, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { createServerClient } from "@/lib/supabase";
import { parsePeriod, getDateRangeForPeriod, getPeriodLabel } from "@/lib/admin-period";
import { PeriodSelector } from "./PeriodSelector";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = parsePeriod(params.period ?? null);
  const { fromIso } = getDateRangeForPeriod(period);
  const periodLabel = getPeriodLabel(period);

  const supabase = createServerClient();

  const [
    { count: totalLeads },
    { count: leadsInPeriod },
    { count: visitsInPeriod },
    { count: clicksInPeriod },
    topProjectSlug,
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", fromIso),
    supabase.from("page_visits").select("*", { count: "exact", head: true }).gte("visited_at", fromIso),
    supabase.from("button_clicks").select("*", { count: "exact", head: true }).gte("clicked_at", fromIso),
    supabase
      .from("page_visits")
      .select("project_slug")
      .gte("visited_at", fromIso)
      .then((r) => {
        if (!r.data?.length) return null;
        const counts: Record<string, number> = {};
        r.data.forEach((row: { project_slug: string }) => {
          counts[row.project_slug] = (counts[row.project_slug] ?? 0) + 1;
        });
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        return sorted[0]?.[0] ?? null;
      }),
  ]);

  const stats = [
    { label: "Total leads", value: totalLeads ?? 0, icon: Users, iconClass: "text-blue-600" },
    { label: `Leads (${periodLabel})`, value: leadsInPeriod ?? 0, icon: UserPlus, iconClass: "text-emerald-600" },
    { label: `Page visits (${periodLabel})`, value: visitsInPeriod ?? 0, icon: Eye, iconClass: "text-sky-500" },
    { label: `Button clicks (${periodLabel})`, value: clicksInPeriod ?? 0, icon: MousePointerClick, iconClass: "text-violet-500" },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-navy">
          <LayoutDashboard size={28} className="text-gold shrink-0" aria-hidden />
          Dashboard
        </h1>
        <Suspense fallback={<div className="h-9 w-32 rounded-lg bg-navy/10 animate-pulse" />}>
          <PeriodSelector />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, iconClass }) => (
          <div
            key={label}
            className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
          >
            <p className="flex items-center gap-2 text-sm text-muted mb-1">
              <Icon size={16} className={`shrink-0 ${iconClass}`} aria-hidden />
              {label}
            </p>
            <p className="text-2xl font-bold text-navy">{value}</p>
          </div>
        ))}
      </div>
      {topProjectSlug && (
        <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm text-muted mb-1">
            <TrendingUp size={16} className="text-emerald-600 shrink-0" aria-hidden />
            Most visited ({periodLabel})
          </p>
          <p className="text-lg font-semibold text-navy">{topProjectSlug}</p>
        </div>
      )}
    </div>
  );
}
