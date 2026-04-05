import type { ProjectContent } from "@/types/project";
import { content as aliva } from "./aliva";

export function getProjectBySlug(slug: string): ProjectContent | null {
  return slug === aliva.slug ? aliva : null;
}

export function getAllProjectSlugs(): string[] {
  return [aliva.slug];
}
