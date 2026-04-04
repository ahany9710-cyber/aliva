import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugs } from "@/content/projects";
import { createServerClient } from "@/lib/supabase";
import { getSearchParam } from "@/lib/utils";
import { LandingPageTemplate } from "@/components/LandingPageTemplate";
import { VisitTracker } from "@/components/analytics/VisitTracker";
import type { NextSearchParams } from "@/types/next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<NextSearchParams>;
}

/**
 * Dynamic route: /mountainview, /tajcity, etc.
 * Best for Google Ads: short, project-specific URLs without /project/ prefix.
 * New projects = add content file + registry entry only; no route changes.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Beitlee" };

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

export function generateStaticParams() {
  /** Static `app/ras-el-hekma/page.tsx` owns this URL; exclude from dynamic SSG. */
  return getAllProjectSlugs()
    .filter((slug) => slug !== "ras-el-hekma")
    .map((slug) => ({ slug }));
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const supabase = createServerClient();
  const { data: settingsRow } = await supabase
    .from("page_settings")
    .select("phone, whatsapp_number")
    .eq("project_slug", slug)
    .maybeSingle();

  const settings = settingsRow as { phone: string | null; whatsapp_number: string | null } | null;
  const phoneOverride = settings?.phone ?? undefined;
  const whatsappOverride = settings?.whatsapp_number ?? undefined;

  return (
    <>
      <VisitTracker
        projectSlug={slug}
        utmSource={getSearchParam(search?.utm_source)}
        utmCampaign={getSearchParam(search?.utm_campaign)}
      />
      <LandingPageTemplate
        project={project}
        searchParams={search}
        phoneOverride={phoneOverride}
        whatsappOverride={whatsappOverride}
      />
    </>
  );
}
