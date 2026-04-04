import type { ProjectContent } from "@/types/project";
import { content as aliva } from "./aliva";
import { content as mountainview } from "./mountainview";
import { content as rasElHekma } from "./ras-el-hekma";

/**
 * Registry: one entry per project. File name = slug; each file exports `content: ProjectContent`.
 * Add a new project: create content/projects/<slug>.ts with `export const content: ProjectContent = { ... }`,
 * then add here: import { content as <slug> } from "./<slug>"; and add <slug> to the object.
 */
const projects: Record<string, ProjectContent> = {
  [aliva.slug]: aliva,
  mountainview,
  [rasElHekma.slug]: rasElHekma,
};

export function getProjectBySlug(slug: string): ProjectContent | null {
  return projects[slug] ?? null;
}

export function getAllProjectSlugs(): string[] {
  return Object.keys(projects);
}
