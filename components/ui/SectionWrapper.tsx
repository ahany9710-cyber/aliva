"use client";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({
  children,
  className,
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto", className)}
    >
      {children}
    </section>
  );
}
