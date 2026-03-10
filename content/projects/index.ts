import type { ProjectContent } from "@/types/project";
import { mountainViewContent } from "./mountainview";

/**
 * Registry of all project landing pages.
 * Add a new project: create content/projects/<slug>.ts and add an entry here.
 * The [slug] route will serve it at /<slug> (e.g. /mountainview, /tajcity).
 */
const projects: Record<string, ProjectContent> = {
  mountainview: mountainViewContent,
};

export function getProjectBySlug(slug: string): ProjectContent | null {
  return projects[slug] ?? null;
}

export function getAllProjectSlugs(): string[] {
  return Object.keys(projects);
}
