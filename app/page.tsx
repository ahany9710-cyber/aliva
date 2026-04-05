import type { Metadata } from "next";
import { content as project } from "@/content/projects/aliva";
import { LandingPageTemplate } from "@/components/LandingPageTemplate";

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

export default function HomePage() {
  return <LandingPageTemplate project={project} />;
}
