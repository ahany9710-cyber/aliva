"use client";

import dynamic from "next/dynamic";
import type { ProjectContent } from "@/types/project";
import { isAlivaLandingSlug } from "@/lib/aliva-landing";
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
const WhyThisSection = dynamic(
  () => import("@/components/sections/WhyThisSection").then((m) => ({ default: m.WhyThisSection })),
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
  phoneOverride?: string;
  whatsappOverride?: string;
}

/**
 * Aliva at `/`: Hero → Units → Why → Location → Pricing → Highlights → Lead → FAQ → Final CTA.
 */
export function LandingPageTemplate({
  project,
  phoneOverride,
  whatsappOverride,
}: LandingPageTemplateProps) {
  const contactPhone =
    phoneOverride ?? project.phoneNumber ?? project.whatsappNumber;
  const contactWhatsapp = whatsappOverride ?? project.whatsappNumber;
  const alivaLanding = isAlivaLandingSlug(project.slug);

  return (
    <>
      {alivaLanding && (
        <WindowSplashScreen shutterImageSrc="/shutters.webp" />
      )}
      <MinimalHeader
        projectSlug={project.slug}
        projectName={project.projectName}
        whatsappNumber={contactWhatsapp}
        callPhone={contactPhone}
        registerInterestLabel={project.leadFormCtaText ?? "سجّل اهتمامك"}
        whatsappInquiryMessage={project.whatsappInquiryMessage}
        logoSrc={alivaLanding ? "/Mountain View Logo.webp" : undefined}
        logoAlt={alivaLanding ? project.projectName : undefined}
        overHero={!!project.heroVideo}
        mvStyle={alivaLanding}
      />
      <main className="pb-16 md:pb-0 bg-gradient-to-b from-white via-slate-50/40 to-white">
        <HeroSection project={project} contactPhone={contactPhone} />
        {alivaLanding && (
          <UnitsCardsSection project={project} contactPhone={contactPhone} contactWhatsapp={contactWhatsapp} />
        )}
        <WhyThisSection project={project} />
        <LocationSection project={project} />
        <PricingSection project={project} contactPhone={contactPhone} />
        <HighlightsSection
          project={project}
          contactPhone={contactPhone}
          contactWhatsapp={contactWhatsapp}
        />
        <LeadFormSection project={project} />
        <FAQSection project={project} />
        <FinalCTASection project={project} contactWhatsapp={contactWhatsapp} />
      </main>
      <MinimalFooter mvStyle={alivaLanding} projectName={project.projectName} />
      <StickyMobileCTA
        projectSlug={project.slug}
        whatsappNumber={contactWhatsapp}
        callPhone={contactPhone}
        ctaText={project.ctaText}
        projectName={project.projectName}
      />
    </>
  );
}
