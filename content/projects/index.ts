import type { ProjectContent } from "@/types/project";
import { content as aliva } from "./aliva";
import { content as grandValleys } from "./grand-valleys";
import { content as hydeParkLaunch } from "./hyde-park-launch";

const REGISTRY: Record<string, ProjectContent> = {
  [aliva.slug]: aliva,
  [grandValleys.slug]: grandValleys,
  [hydeParkLaunch.slug]: hydeParkLaunch,
};

/** Ordered list used by the multi-project landing page (top → bottom). */
export const ALL_PROJECTS: ProjectContent[] = [aliva, grandValleys, hydeParkLaunch];

export function getProjectBySlug(slug: string): ProjectContent | null {
  return REGISTRY[slug] ?? null;
}

export function getAllProjectSlugs(): string[] {
  return Object.keys(REGISTRY);
}
