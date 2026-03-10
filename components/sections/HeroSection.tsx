"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { buildWhatsAppUrl } from "@/lib/utils";
import type { ProjectContent } from "@/types/project";

interface HeroSectionProps {
  project: ProjectContent;
}

export function HeroSection({ project }: HeroSectionProps) {
  const whatsappUrl = buildWhatsAppUrl(
    project.whatsappNumber,
    `مرحباً، أريد الاستفسار عن مشروع ${project.projectName}`
  );

  return (
    <section className="relative pt-6 pb-16 md:pt-10 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="order-2 md:order-1"
        >
          {project.offerBadge && (
            <Badge variant="gold" className="mb-4">
              {project.offerBadge}
            </Badge>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy leading-tight">
            {project.headline}
          </h1>
          <p className="mt-4 text-lg text-muted">{project.subheadline}</p>
          <p className="mt-3 text-foreground">{project.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">{project.ctaText}</Button>
            </a>
            <a href="#lead-form">
              <Button variant="outline" size="lg">
                اطلب استشارة
              </Button>
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-navy/5"
        >
          <Image
            src={project.heroImage}
            alt={project.projectName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
