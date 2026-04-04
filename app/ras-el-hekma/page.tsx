import type { Metadata } from "next";
import { content as project } from "@/content/projects/ras-el-hekma";
import { RasElHekmaTemplate } from "@/components/ras-el-hekma/RasElHekmaTemplate";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import { createServerClient } from "@/lib/supabase";
import { getSearchParam } from "@/lib/utils";
import type { NextSearchParams } from "@/types/next";

interface PageProps {
  searchParams: Promise<NextSearchParams>;
}

export async function generateMetadata(): Promise<Metadata> {
  const title = project.seoTitle;
  const description = project.seoDescription;
  const ogImage = project.ogImage ?? project.heroImage;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function RasElHekmaPage({ searchParams }: PageProps) {
  const search = await searchParams;
  const supabase = createServerClient();
  const { data: settingsRow } = await supabase
    .from("page_settings")
    .select("phone, whatsapp_number")
    .eq("project_slug", project.slug)
    .maybeSingle();

  const settings = settingsRow as { phone: string | null; whatsapp_number: string | null } | null;
  const contactPhone =
    settings?.phone ??
    settings?.whatsapp_number ??
    project.whatsappNumber;
  const contactWhatsapp = settings?.whatsapp_number ?? project.whatsappNumber;

  return (
    <>
      <VisitTracker
        projectSlug={project.slug}
        utmSource={getSearchParam(search?.utm_source)}
        utmCampaign={getSearchParam(search?.utm_campaign)}
      />
      <RasElHekmaTemplate
        project={project}
        searchParams={search}
        contactPhone={contactPhone}
        contactWhatsapp={contactWhatsapp}
      />
    </>
  );
}
