import { createServerClient } from "@/lib/supabase";

export default async function AdminAnalyticsPage() {
  const supabase = createServerClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const fromIso = thirtyDaysAgo.toISOString();

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
      <h1 className="text-2xl font-bold text-navy mb-6">التحليلات</h1>
      <p className="text-muted text-sm mb-6">آخر ٣٠ يوماً — زيارات الصفحات ونقرات الأزرار.</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-navy mb-4">زيارات الصفحات (حسب اليوم)</h2>
        <div className="rounded-xl border border-navy/10 bg-white overflow-x-auto">
          <table className="w-full text-right min-w-[400px]">
            <thead className="bg-navy/5 border-b border-navy/10">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-navy">المشروع</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">التاريخ</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">العدد</th>
              </tr>
            </thead>
            <tbody>
              {slugOrder.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted">
                    لا توجد زيارات حتى الآن.
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
        <h2 className="text-lg font-semibold text-navy mb-4">نقرات الأزرار (حسب المشروع والنوع)</h2>
        <div className="rounded-xl border border-navy/10 bg-white overflow-x-auto">
          <table className="w-full text-right min-w-[400px]">
            <thead className="bg-navy/5 border-b border-navy/10">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-navy">المشروع</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">زر واتساب (ستيكي)</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">زر اتصال</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">واتساب الهيدر</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">إرسال النموذج</th>
              </tr>
            </thead>
            <tbody>
              {slugOrder.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    لا توجد نقرات حتى الآن.
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
