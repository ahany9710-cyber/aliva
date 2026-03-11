"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import type { Period } from "@/lib/admin-period";

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export function PeriodSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("period") as Period) || "7d";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const period = e.target.value as Period;
    const next = new URLSearchParams(searchParams.toString());
    next.set("period", period);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="admin-period" className="flex items-center gap-2 text-sm font-medium text-navy whitespace-nowrap">
        <Calendar size={16} className="text-amber-600 shrink-0" aria-hidden />
        Period:
      </label>
      <select
        id="admin-period"
        value={current}
        onChange={handleChange}
        className="rounded-lg border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none"
      >
        {PERIODS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
