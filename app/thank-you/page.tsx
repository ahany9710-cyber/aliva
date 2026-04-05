"use client";

import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/utils";
import { content as project } from "@/content/projects/aliva";
import { Button } from "@/components/ui/Button";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

export default function ThankYouPage() {
  const whatsappUrl = buildWhatsAppUrl(
    project.whatsappNumber,
    `مرحباً، تم إرسال استفساري عن مشروع ${project.projectName} وأريد متابعة الحجز`
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full">
                تواصل عبر واتساب
              </Button>
            </a>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full">
                العودة للصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
}
