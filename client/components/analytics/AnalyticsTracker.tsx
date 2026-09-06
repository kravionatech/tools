"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function trackToolUsage(toolSlug: string, toolTitle?: string) {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      type: "tool_use",
      path: window.location.pathname,
      title: toolTitle || document.title,
      toolSlug,
      referrer: document.referrer || "Direct",
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon(`${API_BASE}/api/analytics/events`, blob);
    } else {
      fetch(`${API_BASE}/api/analytics/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Fail silently in client
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Do not track admin portal visits to avoid polluting visitor analytics
    if (!pathname || pathname.startsWith("/admin")) return;

    // Avoid duplicate page view events for identical path on immediate re-renders
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const timer = setTimeout(() => {
      try {
        const payload = {
          type: "page_view",
          path: pathname,
          title: document.title || "",
          referrer: document.referrer || "Direct",
        };

        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
          navigator.sendBeacon(`${API_BASE}/api/analytics/events`, blob);
        } else {
          fetch(`${API_BASE}/api/analytics/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {});
        }
      } catch (err) {
        // Analytics failure should never break user browsing
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
