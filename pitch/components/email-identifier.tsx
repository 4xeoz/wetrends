"use client";

import { useEffect } from "react";
import { posthog } from "@/lib/analytics/posthog";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

/**
 * Reads `?email=` or `?ref=` from the URL and identifies the visitor in PostHog.
 *
 * Use this when sending the pitch link via email:
 *   https://pitch.wetrends.co.uk/thai-terrace?email=owner@thaiterrace.co.uk&utm_source=email&utm_campaign=thai-terrace
 *
 * PostHog will then tie every pageview, video play, and CTA click to that person.
 */
export function EmailIdentifier() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const identifyOnce = () => {
      if (!posthog.__loaded) {
        return false;
      }

      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      const ref = params.get("ref");
      const utmSource = params.get("utm_source");
      const utmCampaign = params.get("utm_campaign");

      const identifier = email || ref;
      if (!identifier) {
        // Nothing to identify, but we're done waiting.
        return true;
      }

      posthog.identify(identifier, {
        email: email || undefined,
        ref: ref || undefined,
        utm_source: utmSource || undefined,
        utm_campaign: utmCampaign || undefined,
        pitch_page: "thai-terrace",
      });

      posthog.capture(ANALYTICS_EVENTS.emailPitchLinkClicked, {
        email: email || undefined,
        ref: ref || undefined,
        utm_source: utmSource || undefined,
        utm_campaign: utmCampaign || undefined,
      });

      // eslint-disable-next-line no-console
      console.log("[EmailIdentifier] identified and captured:", {
        identifier,
        email,
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
