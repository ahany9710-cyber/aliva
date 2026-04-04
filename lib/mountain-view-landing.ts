/** Slugs that share Mountain View branding: splash, units grid, header logo, emblem CTAs. */
const SLUGS = new Set(["mountainview", "aliva"]);

export function isMountainViewLandingSlug(slug: string): boolean {
  return SLUGS.has(slug);
}
