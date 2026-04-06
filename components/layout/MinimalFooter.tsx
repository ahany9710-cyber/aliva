"use client";

import Image from "next/image";
import { Facebook, Instagram, Youtube } from "lucide-react";

interface MinimalFooterProps {
  /** Mountain View–style dark footer with logo and social row. */
  mvStyle?: boolean;
  projectName?: string;
}

export function MinimalFooter({ mvStyle = false, projectName }: MinimalFooterProps) {
  if (mvStyle) {
    return (
      <footer className="bg-navy text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="relative inline-block h-9 w-auto">
              <Image
                src="/Mountain View Logo.webp"
                alt={projectName ? `${projectName} — Mountain View` : "Mountain View"}
                width={160}
                height={40}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </span>
            <p className="text-sm text-white/70 text-center md:text-start">
              © {new Date().getFullYear()} Mountain View for Development
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="text-xs uppercase tracking-widest text-white/50">تابعنا</p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/MountainViewEgypt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={22} strokeWidth={1.75} />
              </a>
              <a
                href="https://www.instagram.com/mountainviewegypt/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={22} strokeWidth={1.75} />
              </a>
              <a
                href="https://www.youtube.com/@MountainViewEgypt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={22} strokeWidth={1.75} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return null;
}
