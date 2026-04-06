"use client";

import { cn } from "@/lib/utils";

const textareaBaseClasses =
  "w-full rounded border border-navy/20 bg-white px-4 py-3 text-foreground focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none resize-none";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <>
      <textarea className={cn(textareaBaseClasses, className)} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </>
  );
}
