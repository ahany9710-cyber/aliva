import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <h1 className="text-2xl font-bold text-navy mb-2">Beitlee</h1>
      <p className="text-muted mb-8 text-center max-w-md">
        عقارات مصر — صفحات هبوط لمشاريع التطوير العقاري.
      </p>
      <Link
        href="/mountainview"
        className="rounded-xl bg-gold text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity"
      >
        Mountain View iCity
      </Link>
    </div>
  );
}
