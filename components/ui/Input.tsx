"use client";

import { cn } from "@/lib/utils";

const inputBaseClasses =
  "w-full rounded border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <>
      <input className={cn(inputBaseClasses, className)} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
}
