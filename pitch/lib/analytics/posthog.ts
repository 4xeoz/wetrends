import posthog from "posthog-js";
import type { AnalyticsEventName, AnalyticsEventProperties } from "./events";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "unknown-site";
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const IS_PLACEHOLDER_KEY = !POSTHOG_KEY || POSTHOG_KEY.includes("your_project_api_key_here");

/**
 * Initializes PostHog once, client-side only. Safe to call multiple times —
 * posthog-js no-ops if already loaded.
 */
export function initPostHog() {
  if (typeof window === "undefined") return;

  if (!POSTHOG_KEY || IS_PLACEHOLDER_KEY) {
    // eslint-disable-next-line no-console
    console.warn("[PostHog] NEXT_PUBLIC_POSTHOG_KEY is missing or still the placeholder.");
    return;
  }

  if (posthog.__loaded) return;

  posthog.init(POSTHOG_KEY, {
    // First-party proxy path (see next.config.ts rewrites) so ad blockers
    // that target posthog.com / *.i.posthog.com don't drop the requests.
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || "https://us.posthog.com",

    // This project is a single static page with no client-side route
    // changes, so unlike the main site we don't need a manual
    // usePathname/useSearchParams pageview tracker — posthog-js's own
    // initial-load capture is correct here.
    capture_pageview: true,
    capture_pageleave: true,

    autocapture: true,

    session_recording: {
      maskAllInputs: true,
    },

    // Anonymous visitors stay event-only; a profile is only created once
    // someone is identified, which keeps free-tier person-profile quota
    // under control.
    person_profiles: "identified_only",

    loaded: (ph) => {
      // Tag every event from this deployment so a single PostHog project
      // can report on multiple client sites, filterable by `site`.
      ph.register({ site: SITE_NAME });

      // eslint-disable-next-line no-console
      console.log("[PostHog] loaded successfully for site:", SITE_NAME);

      if (process.env.NODE_ENV !== "production") {
        ph.debug();
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on_xhr_error: (failedRequest: any) => {
      // eslint-disable-next-line no-console
      console.error("[PostHog] request failed:", failedRequest);
    },
  });
}

export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsEventProperties) {
  if (typeof window === "undefined" || !posthog.__loaded) {
    // eslint-disable-next-line no-console
    console.warn("[PostHog] trackEvent skipped — not loaded:", name);
    return;
  }
  posthog.capture(name, properties);
}

export { posthog };
