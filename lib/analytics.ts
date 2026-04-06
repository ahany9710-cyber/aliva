/**
 * Placeholder for future analytics. No network calls.
 */
export type ButtonId =
  | "cta_whatsapp"
  | "cta_call"
  | "header_whatsapp"
  | "header_phone"
  | "header_register_interest"
  | "lead_submit";

export function trackClick(_projectSlug: string, _buttonId: ButtonId): void {}
