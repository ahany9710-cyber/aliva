"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";
import { telHref } from "@/lib/phone-display";
import { SITE } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

export default function ThankYouPage() {
  const whatsappUrl = buildWhatsAppUrl(
    SITE.whatsappNumber,
    "السلام عليكم، تم إرسال استفساري عبر الموقع وأرغب في متابعة الحجز."
  );
  const callUrl = telHref(SITE.phoneNumber);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-700 mb-6">
            <span className="text-3xl" aria-hidden>
              ✓
            </span>
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">شكراً لتواصلك</h1>
          <p className="text-muted mb-2">
            تم استلام بياناتك بنجاح. مستشار المبيعات هيتواصل معك خلال دقايق.
          </p>
          <p className="text-muted mb-8 text-sm">
            تحب تختصر الانتظار؟ كلمنا أو ابعت واتساب دلوقتي.
          </p>
          <div className="flex flex-col gap-3">
            <a href={callUrl}>
              <Button size="lg" className="w-full gap-2">
                <Phone size={18} aria-hidden />
                اتصل الآن
              </Button>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a]"
              >
                <MessageCircle size={18} aria-hidden />
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
      <MinimalFooter tagline={`${SITE.developer} — مشاريع في القاهرة الجديدة، المستقبل سيتي، والعاصمة الإدارية`} />
    </div>
  );
}
