export type Period = "today" | "7d" | "30d";

export function parsePeriod(period: string | null): Period {
  if (period === "today" || period === "7d" || period === "30d") return period;
  return "7d";
}

/** Timezone for "today" (Egypt — project is Egyptian real estate). */
const TODAY_TIMEZONE = "Africa/Cairo";

function getStartOfTodayInTimezone(timeZone: string): Date {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const year = parseInt(parts.find((p) => p.type === "year")!.value, 10);
  const month = parseInt(parts.find((p) => p.type === "month")!.value, 10) - 1;
  const day = parseInt(parts.find((p) => p.type === "day")!.value, 10);
  // 00:00 in that timezone: Cairo is UTC+2, so 00:00 Cairo = 22:00 previous day UTC
  const utcMidnight = Date.UTC(year, month, day);
  const offsetMs = 2 * 60 * 60 * 1000; // Egypt standard time UTC+2 (no DST since 2015)
  return new Date(utcMidnight - offsetMs);
}

export function getDateRangeForPeriod(period: Period): { fromIso: string } {
  const now = new Date();
  let from: Date;
  if (period === "today") {
    from = getStartOfTodayInTimezone(TODAY_TIMEZONE);
  } else if (period === "7d") {
    from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else {
    from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  return { fromIso: from.toISOString() };
}

export function getPeriodLabel(period: Period): string {
  switch (period) {
    case "today":
      return "Today";
    case "7d":
      return "Last 7 days";
    case "30d":
      return "Last 30 days";
    default:
      return "Last 7 days";
  }
}
