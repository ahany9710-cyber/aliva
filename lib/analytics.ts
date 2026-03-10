/**
 * Client-side analytics helpers. Fire-and-forget; no await needed in click handlers.
 */

const ALLOWED_BUTTON_IDS = [
  "cta_whatsapp",
  "cta_call",
  "header_whatsapp",
  "lead_submit",
] as const;

export type ButtonId = (typeof ALLOWED_BUTTON_IDS)[number];

export function trackClick(projectSlug: string, buttonId: ButtonId): void {
  if (typeof window === "undefined") return;
  fetch("/api/analytics/click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_slug: projectSlug, button_id: buttonId }),
  }).catch(() => {});
}
