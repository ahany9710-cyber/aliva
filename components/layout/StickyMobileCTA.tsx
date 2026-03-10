"use client";

import { buildWhatsAppUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StickyMobileCTAProps {
  whatsappNumber: string;
  ctaText: string;
  projectName?: string;
}

export function StickyMobileCTA({
  whatsappNumber,
  ctaText,
  projectName,
}: StickyMobileCTAProps) {
  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    projectName ? `مرحباً، أريد الاستفسار عن مشروع ${projectName}` : undefined
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur border-t border-navy/10 md:hidden">
      <div className="max-w-lg mx-auto flex gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-3 px-4 font-medium text-sm hover:bg-[#20bd5a] transition-colors"
        >
          WhatsApp
        </a>
        <a
          href="#lead-form"
          className={cn(
            "flex-1 inline-flex items-center justify-center rounded-xl bg-gold text-white py-3 px-4 font-medium text-sm shadow-md hover:opacity-90 transition-opacity"
          )}
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}
