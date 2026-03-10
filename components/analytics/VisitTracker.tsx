"use client";

import { useEffect } from "react";

interface VisitTrackerProps {
  projectSlug: string;
  utmSource?: string;
  utmCampaign?: string;
  referrer?: string;
}

export function VisitTracker({
  projectSlug,
  utmSource,
  utmCampaign,
  referrer,
}: VisitTrackerProps) {
  useEffect(() => {
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_slug: projectSlug,
        utm_source: utmSource,
        utm_campaign: utmCampaign,
        referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
      }),
    }).catch(() => {});
  }, [projectSlug, utmSource, utmCampaign, referrer]);

  return null;
}
