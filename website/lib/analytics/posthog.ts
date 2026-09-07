import posthog from "posthog-js";
import type { AnalyticsEventName, AnalyticsEventProperties } from "./events";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "unknown-site";
let lastPageviewUrl = "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

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

    // Off deliberately. Autocapture fires an event for every click, change and
    // submit anywhere on the site — thousands of `$autocapture` rows a week that
    // nobody queries, on a site where the handful of actions that actually
    // matter are already tracked explicitly in `events.ts`. Turn it back on only
    // to answer a specific question, then turn it off again.
    autocapture: false,

    // Same reasoning: recording every visitor is the definition of capturing
    // everything, and replays are the fastest way through a PostHog quota.
    // Flip to `false` and restore the session_recording block below to re-enable.
    disable_session_recording: true,

    // These features may be enabled by remote PostHog project settings when
    // their local values are left undefined. Keep this implementation limited
    // to the deliberate conversion events below: no interaction maps, inferred
    // frustration signals, performance telemetry or exception capture.
    capture_heatmaps: false,
    capture_dead_clicks: false,
    capture_performance: false,
    capture_exceptions: false,
    disable_surveys: true,
    disable_surveys_automatic_display: true,
    disable_product_tours: true,

    // Bounce rate and time-on-page need this, and it is one event per visit.
    capture_pageleave: true,

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
  if (typeof window === "undefined") return;
  if (posthog.__loaded) posthog.capture(name, properties);
  window.gtag?.("event", name, properties ?? {});
}

export function capturePageview(url: string) {
  if (typeof window === "undefined" || url === lastPageviewUrl) return;
  lastPageviewUrl = url;
  if (posthog.__loaded) posthog.capture("$pageview", { $current_url: url });
  window.gtag?.("event", "page_view", {
    page_location: url,
    page_path: new URL(url).pathname,
  });
}

export function identifyUser(distinctId: string, properties?: AnalyticsEventProperties) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.identify(distinctId, properties);
}

export { posthog };
