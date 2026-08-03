"use client";

import { useEffect } from "react";
import { posthog } from "@/lib/analytics/posthog";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { resolveVisit } from "@/lib/analytics/audience";

/**
 * Identifies the visitor from the link they followed and stamps every
 * subsequent event on the page with who they are.
 *
 * Registering `audience` as a super property (rather than only setting it on
 * the arrival event) is the point: a "video watched to the end" three weeks
 * later still says whether it was the client or one of us.
 */
export function PitchTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const identifyOnce = () => {
      if (!posthog.__loaded) return false;

      const visit = resolveVisit(window.location.search, slug);

      const shared = {
        pitch_client: slug,
        audience: visit.audience,
        link_variant: visit.linkVariant,
        internal_device: visit.internalDevice,
        ref: visit.ref,
      };

      // Stamped onto every event from here on, including ones fired long after
      // this effect has run.
      posthog.register(shared);

      if (visit.ref) {
        // Same browser, different link: posthog-js won't re-point an already
        // identified profile, so drop the old identity first rather than
        // silently logging a colleague's rewatch against the client.
        const current = posthog.get_distinct_id();
        if (current !== visit.ref && posthog._isIdentified()) {
          posthog.reset();
          posthog.register(shared);
        }

        posthog.identify(visit.ref, {
          ref: visit.ref,
          pitch_client: slug,
          audience: visit.audience,
          link_variant: visit.linkVariant,
          utm_source: visit.utmSource || undefined,
          utm_campaign: visit.utmCampaign || undefined,
        });
      }

      posthog.capture(ANALYTICS_EVENTS.emailPitchLinkClicked, shared);

      return true;
    };

    if (identifyOnce()) return;

    // PostHog can finish loading slightly after this effect. Retry for 3s.
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (identifyOnce() || attempts > 30) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, [slug]);

  return null;
}
