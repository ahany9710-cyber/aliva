"use client";

import dynamic from "next/dynamic";
import type { ProjectContent } from "@/types/project";
import type { NextSearchParams } from "@/types/next";
import { MinimalHeader } from "@/components/layout/MinimalHeader";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { WindowSplashScreen } from "@/components/WindowSplashScreen";
import { HeroSection } from "@/components/sections/HeroSection";

const UnitsCardsSection = dynamic(
  () => import("@/components/sections/UnitsCardsSection").then((m) => ({ default: m.UnitsCardsSection })),
  { ssr: true }
);
const HighlightsSection = dynamic(
  () => import("@/components/sections/HighlightsSection").then((m) => ({ default: m.HighlightsSection })),
  { ssr: true }
);
const LocationSection = dynamic(
  () => import("@/components/sections/LocationSection").then((m) => ({ default: m.LocationSection })),
  { ssr: true }
);
const PricingSection = dynamic(
  () => import("@/components/sections/PricingSection").then((m) => ({ default: m.PricingSection })),
  { ssr: true }
);
const LeadFormSection = dynamic(
  () => import("@/components/sections/LeadFormSection").then((m) => ({ default: m.LeadFormSection })),
  { ssr: true }
);
const FAQSection = dynamic(
  () => import("@/components/sections/FAQSection").then((m) => ({ default: m.FAQSection })),
  { ssr: true }
);
const FinalCTASection = dynamic(
  () => import("@/components/sections/FinalCTASection").then((m) => ({ default: m.FinalCTASection })),
  { ssr: true }
);

interface LandingPageTemplateProps {
  project: ProjectContent;
  searchParams?: NextSearchParams;
}

/**
 * Single landing page layout: header, all sections in order, footer, sticky mobile CTA.
 * Used by the dynamic [slug] route — add new projects by adding content only.
 */
export function LandingPageTemplate({ project, searchParams }: LandingPageTemplateProps) {
  return (
    <>
      {project.slug === "mountainview" && (
        <WindowSplashScreen shutterImageSrc="/shutters.png" />
      )}
      <MinimalHeader
        projectName={project.projectName}
        whatsappNumber={project.whatsappNumber}
        logoSrc={project.slug === "mountainview" ? "/Mountain View Logo.png" : undefined}
        logoAlt={project.slug === "mountainview" ? project.projectName : undefined}
        overHero={!!project.heroVideo}
      />
      <main className="pb-24 md:pb-0">
        <HeroSection project={project} />
        {project.slug === "mountainview" && <UnitsCardsSection project={project} />}
        <HighlightsSection project={project} />
        <LocationSection project={project} />
        <PricingSection project={project} />
        <LeadFormSection project={project} searchParams={searchParams} />
        <FAQSection project={project} />
        <FinalCTASection project={project} />
      </main>
      <StickyMobileCTA
        whatsappNumber={project.whatsappNumber}
        ctaText={project.ctaText}
        projectName={project.projectName}
      />
    </>
  );
}
