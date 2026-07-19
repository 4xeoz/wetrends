"use client";

import { useEffect } from "react";
import { posthog } from "@/lib/analytics/posthog";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

/**
 * Reads `?ref=` from the URL and identifies the visitor in PostHog by that
 * opaque reference — never by raw email address.
 *
 * Use this when sending the pitch link via email:
 *   https://<pitch-domain>/thai-terrace?ref=thai-terrace-owner&utm_source=email&utm_campaign=thai-terrace
 *
 * Deliberately not `?email=owner@business.co.uk`: putting a recipient's raw
 * email address in a link sent via cold outreach is the same technical
 * signature as a spear-phishing tracking link, and gets reported/flagged as
 * such by mail providers and Safe Browsing scanners even when the page
 * itself is benign. `ref` gives the same per-recipient attribution in
 * PostHog without that risk.
 *
 * PostHog will then tie every pageview, video play, and CTA click to that ref.
 */
export function EmailIdentifier() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const identifyOnce = () => {
      if (!posthog.__loaded) {
        return false;
      }

      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      const utmSource = params.get("utm_source");
      const utmCampaign = params.get("utm_campaign");

      if (!ref) {
        // Nothing to identify, but we're done waiting.
        return true;
      }

      posthog.identify(ref, {
        ref,
        utm_source: utmSource || undefined,
        utm_campaign: utmCampaign || undefined,
        pitch_page: "thai-terrace",
      });

      posthog.capture(ANALYTICS_EVENTS.emailPitchLinkClicked, {
        ref,
        utm_source: utmSource || undefined,
        utm_campaign: utmCampaign || undefined,
      });

      // eslint-disable-next-line no-console
      console.log("[EmailIdentifier] identified and captured:", {
        ref,
        utmSource,
        utmCampaign,
      });

      return true;
    };

    if (identifyOnce()) {
      return;
    }

    // PostHog can load slightly after this effect runs. Retry for 3 seconds.
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (identifyOnce() || attempts > 30) {
        clearInterval(interval);
        if (attempts > 30) {
          // eslint-disable-next-line no-console
          console.warn("[EmailIdentifier] PostHog never loaded — could not identify visitor.");
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return null;
}
