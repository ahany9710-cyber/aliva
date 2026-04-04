import { Building2 } from "lucide-react";
import Link from "next/link";
import { MinimalFooter } from "@/components/layout/MinimalFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-navy mb-2">Beitlee</h1>
        <p className="text-muted mb-8 text-center max-w-md">
          عقارات مصر — صفحات هبوط لمشاريع التطوير العقاري.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/mountainview"
            className="inline-flex items-center gap-2 rounded-xl bg-gold text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity"
          >
            <Building2 size={20} aria-hidden />
            أليڤا
          </Link>
          <Link
            href="/ras-el-hekma"
            className="inline-flex items-center gap-2 rounded-xl border border-navy/20 bg-white text-navy px-6 py-3 font-medium hover:bg-navy/5 transition-colors"
          >
            <Building2 size={20} aria-hidden />
            راس الحكمة
          </Link>
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
}
