"use client";

import Link from "next/link";

export function MinimalFooter() {
  return (
    <footer className="border-t border-navy/10 bg-navy/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center text-sm text-muted">
        <p>
          Beitlee — عقارات مصر. للمعلومات والاستفسارات يرجى التواصل عبر النموذج أو واتساب.
        </p>
        <p className="mt-2">
          <Link href="/" className="text-navy hover:underline">
            الرئيسية
          </Link>
        </p>
      </div>
    </footer>
  );
}
