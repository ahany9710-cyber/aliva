import { createServerClient } from "@/lib/supabase";

export default async function AdminLeadsPage() {
  const supabase = createServerClient();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-navy mb-6">العملاء المحتملون</h1>
        <p className="text-red-600">خطأ في تحميل البيانات.</p>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">العملاء المحتملون</h1>
        <a
          href="/api/admin/leads/export"
          className="rounded-xl bg-gold text-white px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          تصدير CSV
        </a>
      </div>
      <div className="rounded-xl border border-navy/10 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-navy/5 border-b border-navy/10">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-navy">التاريخ</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">المشروع</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">الاسم</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">الهاتف</th>
                <th className="px-4 py-3 text-sm font-semibold text-navy">المصدر</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    لا توجد بيانات حتى الآن.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-navy/5 hover:bg-navy/[0.02]">
                    <td className="px-4 py-3 text-sm text-navy">
                      {new Date(r.created_at).toLocaleDateString("ar-EG")}
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
