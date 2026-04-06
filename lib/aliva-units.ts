/** Labels shown on unit cards (scroll section) — keep in sync with form dropdown. */
export const ALIVA_UNIT_CARD_LABELS: Record<number, string> = {
  1: "شقة ٣ غرف",
  2: "آي ڤيلا",
  3: "تاون هاوس",
};

/** Options for lead form (first value = no selection). */
export const ALIVA_UNIT_FORM_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "نوع الوحدة (اختياري)" },
  { value: "شقة ٣ غرف", label: "شقة ٣ غرف" },
  { value: "آي ڤيلا", label: "آي ڤيلا" },
  { value: "تاون هاوس", label: "تاون هاوس" },
];
