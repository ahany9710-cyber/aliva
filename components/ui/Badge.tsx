"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "outline";
}

export function Badge({
  children,
  className,
  variant = "default",
}: BadgeProps) {
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
