"use client";

import { Suspense } from "react";
import type { ProjectContent } from "@/types/project";
import { MinimalHeader } from "@/components/layout/MinimalHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightsSection } from "@/components/sections/HighlightsSection";
import { WhyThisSection } from "@/components/sections/WhyThisSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

interface LandingPageTemplateProps {
  project: ProjectContent;
}

/**
 * Single landing page layout: header, all sections in order, footer, sticky mobile CTA.
 * Used by the dynamic [slug] route — add new projects by adding content only.
 */
export function LandingPageTemplate({ project }: LandingPageTemplateProps) {
  return (
    <>
      <MinimalHeader
        projectName={project.projectName}
        whatsappNumber={project.whatsappNumber}
      />
      <main className="pb-24 md:pb-0">
        <HeroSection project={project} />
        <HighlightsSection project={project} />
        <WhyThisSection project={project} />
        <LocationSection project={project} />
        <PricingSection project={project} />
        <Suspense fallback={<div className="py-16 text-center text-muted">جاري التحميل...</div>}>
          <LeadFormSection project={project} />
        </Suspense>
        <FAQSection project={project} />
        <FinalCTASection project={project} />
      </main>
      <MinimalFooter />
      <StickyMobileCTA
        whatsappNumber={project.whatsappNumber}
        ctaText={project.ctaText}
        projectName={project.projectName}
      />
    </>
  );
}
