"use client";

import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/utils";

interface MinimalHeaderProps {
  projectName?: string;
  whatsappNumber: string;
}

export function MinimalHeader({ projectName, whatsappNumber }: MinimalHeaderProps) {
  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    projectName ? `مرحباً، أريد الاستفسار عن مشروع ${projectName}` : undefined
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-navy text-lg">
          Beitlee
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] text-white px-4 py-2 text-sm font-medium hover:bg-[#20bd5a] transition-colors"
        >
          <span aria-hidden>WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
