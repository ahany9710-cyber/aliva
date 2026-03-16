/**
 * Shared validation for lead form and API.
 * Supports Egypt, Saudi Arabia, Bahrain, UAE, and Qatar.
 */

/** Egypt: +20, then 10 digits (1[0-2,5] + 8 digits). */
export const EGYPT_PHONE_REGEX = /^(\+20|0)?1[0-2,5][0-9]{8}$/;

/** Saudi Arabia: +966, then 9 digits (mobile 5 + 8 digits). */
const SAUDI_REGEX = /^(\+966|0)?5[0-9]{8}$/;
/** UAE: +971, then 9 digits (50/52/54/55/56/58 + 6 digits). */
const UAE_REGEX = /^(\+971|0)?5[02568][0-9]{6}$/;
/** Bahrain: +973 or 973, then 8 digits (country code required). */
const BAHRAIN_REGEX = /^(\+973|973)[0-9]{8}$/;
/** Qatar: +974 or 974, then 8 digits (country code required). */
const QATAR_REGEX = /^(\+974|974)[0-9]{8}$/;

function stripSpaces(value: string): string {
  return value.replace(/\s/g, "");
}

/**
 * Normalize phone to E.164 (e.g. +201012345678).
 * Returns empty string if invalid.
 */
export function normalizePhone(value: string): string {
  const s = stripSpaces(value);
  const digits = s.replace(/\D/g, "").replace(/^0+/, "");
  if (digits.length === 0) return "";

  // Egypt: 20 + 10 digits
  if (EGYPT_PHONE_REGEX.test(s)) {
    const national = digits.startsWith("20") ? digits.slice(2) : digits;
    if (national.length === 10 && /^1[0-25][0-9]{8}$/.test(national)) return "+20" + national;
  }

  // Saudi: 966 + 9 digits
  if (SAUDI_REGEX.test(s)) {
    const national = digits.startsWith("966") ? digits.slice(3) : digits;
    if (national.length === 9 && /^5[0-9]{8}$/.test(national)) return "+966" + national;
  }

  // UAE: 971 + 9 digits
  if (UAE_REGEX.test(s)) {
    const national = digits.startsWith("971") ? digits.slice(3) : digits;
    if (national.length === 9 && /^5[02568][0-9]{6}$/.test(national)) return "+971" + national;
  }

  // Bahrain: 973 + 8 digits (country code required)
  if (BAHRAIN_REGEX.test(s) && digits.startsWith("973") && digits.length === 11)
    return "+" + digits;

  // Qatar: 974 + 8 digits (country code required)
  if (QATAR_REGEX.test(s) && digits.startsWith("974") && digits.length === 11)
    return "+" + digits;

  return "";
}

/**
 * Validate phone for Egypt, Saudi Arabia, Bahrain, UAE, or Qatar.
 */
export function isValidGccOrEgyptPhone(value: string): boolean {
  return normalizePhone(value).length > 0;
}

// Legacy: normalizeEgyptPhone now normalizes any supported country to E.164
export function normalizeEgyptPhone(value: string): string {
  const out = normalizePhone(value);
  return out || stripSpaces(value);
}

export function isValidEgyptPhone(value: string): boolean {
  return isValidGccOrEgyptPhone(value);
}
