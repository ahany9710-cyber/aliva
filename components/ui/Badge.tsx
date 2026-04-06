"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "outline" | "hot" | "hotLight";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  if (variant === "hot") {
    return (
      <span
        className={cn(
          "inline-flex max-w-full items-center gap-2.5 rounded-full",
          // solid dark base — legible over any video frame
          "border border-white/25 bg-black/62 px-4 py-[7px]",
          "text-sm font-semibold leading-snug text-white backdrop-blur-md",
          "shadow-[0_2px_20px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/12",
          "transition-[border-color,background-color,box-shadow] duration-200",
          "hover:border-amber-300/55 hover:bg-black/72 hover:shadow-[0_4px_24px_rgba(0,0,0,0.55)]",
          className
        )}
        aria-label={`عرض: ${typeof children === "string" ? children : ""}`}
      >
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <span className="truncate">{children}</span>
      </span>
    );
  }

  if (variant === "hotLight") {
    return (
      <span
        className={cn(
          "inline-flex max-w-full items-center gap-2.5 rounded-full",
          "border border-navy/12 bg-white px-3.5 py-1.5",
          "text-sm font-medium text-navy shadow-sm ring-1 ring-navy/[0.04]",
          "transition-[border-color,box-shadow] duration-200 hover:border-amber-500/40 hover:shadow-md",
          className
        )}
      >
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        <span className="truncate">{children}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        variant === "default" && "bg-navy/10 text-navy",
        variant === "gold" && "bg-navy/10 text-navy",
        variant === "outline" && "border border-navy/30 text-navy",
        className
      )}
    >
      {children}
    </span>
  );
}
