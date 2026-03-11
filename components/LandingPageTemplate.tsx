"use client";

import dynamic from "next/dynamic";
import type { ProjectContent } from "@/types/project";
import type { NextSearchParams } from "@/types/next";
import { MinimalHeader } from "@/components/layout/MinimalHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
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
  /** Override from admin page_settings (call number). */
  phoneOverride?: string;
  /** Override from admin page_settings (WhatsApp number). */
  whatsappOverride?: string;
}

/**
 * Single landing page layout: header, all sections in order, footer, sticky mobile CTA.
 * Used by the dynamic [slug] route — add new projects by adding content only.
 */
export function LandingPageTemplate({
  project,
  searchParams,
  phoneOverride,
  whatsappOverride,
}: LandingPageTemplateProps) {
  const contactPhone = phoneOverride ?? project.whatsappNumber;
  const contactWhatsapp = whatsappOverride ?? project.whatsappNumber;

  return (
    <>
      {project.slug === "mountainview" && (
        <WindowSplashScreen shutterImageSrc="/shutters.png" />
      )}
      <MinimalHeader
        projectSlug={project.slug}
        projectName={project.projectName}
        whatsappNumber={contactWhatsapp}
        logoSrc={project.slug === "mountainview" ? "/Mountain View Logo.png" : undefined}
        logoAlt={project.slug === "mountainview" ? project.projectName : undefined}
        overHero={!!project.heroVideo}
      />
      <main className="pb-24 md:pb-0">
        <HeroSection project={project} contactPhone={contactPhone} />
        {project.slug === "mountainview" && (
          <UnitsCardsSection project={project} contactPhone={contactPhone} contactWhatsapp={contactWhatsapp} />
        )}
        <HighlightsSection project={project} />
        <LocationSection project={project} />
        <PricingSection project={project} contactPhone={contactPhone} />
        <LeadFormSection project={project} searchParams={searchParams} />
        <FAQSection project={project} />
        <FinalCTASection project={project} contactWhatsapp={contactWhatsapp} />
      </main>
      <MinimalFooter />
      <StickyMobileCTA
        projectSlug={project.slug}
        whatsappNumber={contactWhatsapp}
        ctaText={project.ctaText}
        projectName={project.projectName}
      />
    </>
  );
}
