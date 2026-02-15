"use client";

import { useEffect } from "react";

interface PageViewTrackerProps {
  path: string;
  targetType?: "project" | "skill" | "page";
  targetSlug?: string;
}

export default function PageViewTracker({
  path,
  targetType = "page",
  targetSlug,
}: PageViewTrackerProps) {
  useEffect(() => {
    const endpoint = "/api/analytics/page-view";
    const payload = {
      path,
      targetType,
      targetSlug: targetSlug || null,
    };

    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });

    if (!navigator.sendBeacon(endpoint, blob)) {
      void fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
  }, [path, targetSlug, targetType]);

  return null;
}
