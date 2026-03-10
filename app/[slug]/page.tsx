import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugs } from "@/content/projects";
import { LandingPageTemplate } from "@/components/LandingPageTemplate";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <LandingPageTemplate project={project} searchParams={search} />;
}
