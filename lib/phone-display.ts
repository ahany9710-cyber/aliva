/** E.164-ish stored whatsapp/call numbers → tel: and readable display. */

export function digitsOnlyPhone(s: string): string {
  return s.replace(/\D/g, "");
}

export function telHref(phone: string): string {
  const d = digitsOnlyPhone(phone);
  return d ? `tel:+${d}` : "#";
}

/**
 * Human-readable phone for UI (keeps digits; light spacing for Egypt +20).
 */
export function formatPhoneDisplay(phone: string): string {
  const d = digitsOnlyPhone(phone);
  if (!d) return "";
  if (d.startsWith("20") && d.length >= 10) {
    return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4)}`;
  }
  return `+${d}`;
}
