import posthog from "posthog-js";
import type { AnalyticsEventName, AnalyticsEventProperties } from "./events";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "unknown-site";

/**
 * Initializes PostHog once, client-side only. Safe to call multiple times —
 * posthog-js no-ops if already loaded.
 */
export function initPostHog() {
  if (typeof window === "undefined") return;

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return;

  if (posthog.__loaded) return;

  posthog.init(apiKey, {
    // First-party proxy path (see next.config.ts rewrites) so ad blockers
    // that target posthog.com / *.i.posthog.com don't drop the requests.
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://us.posthog.com",

    // App Router does full client-side route transitions without a real
    // page load, so we capture pageviews manually on route change instead.
    capture_pageview: false,
    capture_pageleave: true,

    autocapture: true,

    session_recording: {
      maskAllInputs: true,
    },

    // Anonymous visitors stay event-only; a profile is only created once
    // someone is identified (e.g. after submitting a form), which keeps
    // free-tier person-profile quota under control.
    person_profiles: "identified_only",

    loaded: (ph) => {
      // Tag every event from this deployment so a single PostHog project
      // can report on multiple client sites, filterable by `site`.
      ph.register({ site: SITE_NAME });

      if (process.env.NODE_ENV !== "production") {
        ph.debug();
      }
    },
  });
}

export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsEventProperties) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.capture(name, properties);
}

export function capturePageview(url: string) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.capture("$pageview", { $current_url: url });
}

export function identifyUser(distinctId: string, properties?: AnalyticsEventProperties) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.identify(distinctId, properties);
}

export { posthog };
