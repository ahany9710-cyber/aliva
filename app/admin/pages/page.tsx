import { createServerClient } from "@/lib/supabase";
import { getAllProjectSlugs, getProjectBySlug } from "@/content/projects";
import { PageSettingsForm } from "./PageSettingsForm";

export default async function AdminPagesPage() {
  const slugs = getAllProjectSlugs();
  const supabase = createServerClient();
  const { data: settingsRows } = await supabase.from("page_settings").select("*");
  const settingsBySlug = (settingsRows ?? []).reduce(
    (acc, row: { project_slug: string; phone: string | null; whatsapp_number: string | null }) => {
      acc[row.project_slug] = { phone: row.phone, whatsapp_number: row.whatsapp_number };
      return acc;
    },
    {} as Record<string, { phone: string | null; whatsapp_number: string | null }>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">الصفحات — هاتف و واتساب</h1>
      <p className="text-muted text-sm mb-6">
        يمكنك تغيير رقم الهاتف ورقم واتساب لكل صفحة. إن تركت الحقل فارغاً، يُستخدم الرقم الافتراضي من المحتوى.
      </p>
      <div className="space-y-6">
        {slugs.map((slug) => {
          const project = getProjectBySlug(slug);
          const settings = settingsBySlug[slug];
          const defaultNumber = project?.whatsappNumber ?? "";
          return (
            <div key={slug}>
              <h2 className="text-lg font-semibold text-navy mb-2">{slug}</h2>
              <PageSettingsForm
                projectSlug={slug}
                defaultPhone={defaultNumber}
                defaultWhatsapp={defaultNumber}
                savedPhone={settings?.phone ?? null}
                savedWhatsapp={settings?.whatsapp_number ?? null}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
