"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Script from "next/script";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getMetaPixelInlineBootstrap } from "@/lib/meta-fbq";
import { getProjectBySlug } from "@/content/projects";
import { MetaPixelThankYouEvents } from "@/components/analytics/MetaPixelThankYouEvents";
import { isMountainViewLandingSlug } from "@/lib/mountain-view-landing";
import { trackMetaContact } from "@/lib/meta-fbq";
import { Button } from "@/components/ui/Button";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const projectSlug = searchParams.get("project");
  const project = projectSlug ? getProjectBySlug(projectSlug) : null;

  const whatsappNumber = project?.whatsappNumber ?? "201234567890";
  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    project
      ? `مرحباً، تم إرسال استفساري عن مشروع ${project.projectName} وأريد متابعة الحجز`
      : undefined
  );
  const mvThankYou = project && isMountainViewLandingSlug(project.slug);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {mvThankYou && (
        <Script
          id="meta-pixel-thank-you"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: getMetaPixelInlineBootstrap({ viewContent: false }),
          }}
        />
      )}
      {project && <MetaPixelThankYouEvents projectSlug={project.slug} />}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 text-gold mb-6">
            <span className="text-3xl" aria-hidden>
              ✓
            </span>
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">شكراً لتواصلك</h1>
          <p className="text-muted mb-8">
            تم استلام بياناتك بنجاح. سنتواصل معك في أقرب وقت عبر الهاتف أو
            الواتساب.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (project && mvThankYou) {
                  trackMetaContact(project.slug, "thank_you_whatsapp");
                }
              }}
            >
              <Button size="lg" className="w-full">
                تواصل عبر واتساب
              </Button>
            </a>
            <Link href={project ? `/${project.slug}` : "/"}>
              <Button variant="outline" size="lg" className="w-full">
                العودة للمشروع
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="md" className="w-full">
                الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted">جاري التحميل...</p>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
