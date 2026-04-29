import type { Metadata } from "next";
import { ALL_PROJECTS } from "@/content/projects";
import { SITE } from "@/content/site";
import { MinimalHeader } from "@/components/layout/MinimalHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { LeadPopup } from "@/components/LeadPopup";
import { SiteHeroSection } from "@/components/sections/SiteHeroSection";
import { TrustStripSection } from "@/components/sections/TrustStripSection";
import { ProjectShowcaseSection } from "@/components/sections/ProjectShowcaseSection";
import { CompareSection } from "@/components/sections/CompareSection";
import { WhyThisSection } from "@/components/sections/WhyThisSection";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export const metadata: Metadata = {
  // `absolute` skips the layout's "%s | ماونتن ڤيو" template so the brand
  // doesn't get appended to a title that already starts with it.
  title: { absolute: "ماونتن ڤيو — أليڤا، جراند فاليز، وإطلاق هايد بارك الجديد" },
  description:
    "٣ مشاريع من ماونتن ڤيو في القاهرة الجديدة، المستقبل سيتي، والعاصمة الإدارية. مقدم يبدأ من ٥٪، تقسيط حتى ١٠ سنوات. احجز كلمة قصيرة على الهاتف أو واتساب.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ماونتن ڤيو — ٣ مشاريع، مطور واحد",
    description:
      "أليڤا، جراند فاليز، والإطلاق الجديد جوار هايد بارك — اتصل أو راسلنا واتساب.",
    images: [{ url: "/projects/aliva/cover.png", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <>
      <MinimalHeader
        whatsappNumber={SITE.whatsappNumber}
        callPhone={SITE.phoneNumber}
        whatsappInquiryMessage="السلام عليكم، مهتم بمشاريع ماونتن ڤيو وأرغب بالتواصل مع المبيعات."
        overHero
      />
      <main className="pb-24 md:pb-0">
        <SiteHeroSection
          eyebrow={SITE.hero.eyebrow}
          headline={SITE.hero.headline}
          subheadline={SITE.hero.subheadline}
          primaryCta={SITE.hero.primaryCta}
          secondaryCta={SITE.hero.secondaryCta}
          image={SITE.hero.image}
          phoneNumber={SITE.phoneNumber}
          whatsappNumber={SITE.whatsappNumber}
          whatsappMessage="السلام عليكم، شفت الإعلان وعايز أعرف تفاصيل مشاريع ماونتن ڤيو."
        />
        <TrustStripSection facts={SITE.trustFacts} />

        {ALL_PROJECTS.map((project, i) => (
          <ProjectShowcaseSection key={project.slug} project={project} index={i} />
        ))}

        <CompareSection projects={ALL_PROJECTS} />
        <WhyThisSection whyPoints={SITE.whyPoints} />
        <LeadFormSection
          projects={ALL_PROJECTS}
          phoneNumber={SITE.phoneNumber}
          whatsappNumber={SITE.whatsappNumber}
        />
        <FAQSection faqs={SITE.faqs} />
        <FinalCTASection
          phoneNumber={SITE.phoneNumber}
          whatsappNumber={SITE.whatsappNumber}
          whatsappMessage="السلام عليكم، عايز أكلم مستشار مبيعات ماونتن ڤيو دلوقتي."
        />
      </main>
      <MinimalFooter tagline="ماونتن ڤيو في القاهرة الجديدة، المستقبل سيتي، والعاصمة الإدارية" />
      <FloatingWhatsApp
        phoneNumber={SITE.whatsappNumber}
        message="السلام عليكم، شفت الإعلان وعايز أعرف تفاصيل."
      />
      <LeadPopup
        projects={ALL_PROJECTS}
        phoneNumber={SITE.phoneNumber}
        whatsappNumber={SITE.whatsappNumber}
        triggerSelector="#hyde-park-launch"
      />
      <StickyMobileCTA
        whatsappNumber={SITE.whatsappNumber}
        callPhone={SITE.phoneNumber}
        whatsappMessage="السلام عليكم، شفت الإعلان وعايز أكلم مستشار مبيعات ماونتن ڤيو."
      />
    </>
  );
}
