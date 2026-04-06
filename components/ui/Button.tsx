"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "mv-outline" | "gold";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-navy text-white hover:bg-navy/90 shadow-md hover:shadow-lg",
        variant === "secondary" &&
          "bg-navy/10 text-navy hover:bg-navy/15 border border-navy/15",
        variant === "outline" &&
          "border-2 border-navy text-navy hover:bg-navy hover:text-white",
        variant === "mv-outline" &&
          "border border-navy text-navy bg-transparent hover:bg-navy hover:text-white",
        variant === "ghost" && "text-navy hover:bg-navy/5",
        variant === "gold" &&
          "bg-gold text-white hover:bg-amber-600 shadow-md hover:shadow-lg",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-base",
        size === "lg" && "px-8 py-4 text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
