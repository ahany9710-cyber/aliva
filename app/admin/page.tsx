import { createServerClient } from "@/lib/supabase";

export default async function AdminDashboardPage() {
  const supabase = createServerClient();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoIso = weekAgo.toISOString();

  const [
    { count: totalLeads },
    { count: leadsThisWeek },
    { count: visitsThisWeek },
    { count: clicksThisWeek },
    topProjectSlug,
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", weekAgoIso),
    supabase.from("page_visits").select("*", { count: "exact", head: true }).gte("visited_at", weekAgoIso),
    supabase.from("button_clicks").select("*", { count: "exact", head: true }).gte("clicked_at", weekAgoIso),
    supabase
      .from("page_visits")
      .select("project_slug")
      .gte("visited_at", weekAgoIso)
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
    { label: "إجمالي العملاء المحتملين", value: totalLeads ?? 0 },
    { label: "عملاء محتملون (آخر ٧ أيام)", value: leadsThisWeek ?? 0 },
    { label: "زيارات الصفحات (آخر ٧ أيام)", value: visitsThisWeek ?? 0 },
    { label: "نقرات الأزرار (آخر ٧ أيام)", value: clicksThisWeek ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">لوحة التحكم</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-muted mb-1">{label}</p>
            <p className="text-2xl font-bold text-navy">{value}</p>
          </div>
        ))}
      </div>
      {topProjectSlug && (
        <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
          <p className="text-sm text-muted mb-1">الأكثر زيارة (آخر ٧ أيام)</p>
          <p className="text-lg font-semibold text-navy">{topProjectSlug}</p>
        </div>
      )}
    </div>
  );
}
