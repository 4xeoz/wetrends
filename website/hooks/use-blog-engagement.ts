"use client";

import { useEffect, useRef } from "react";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/posthog";

const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 100];

/**
 * Tracks scroll depth (in 25% increments) and total time on page for a single
 * blog post. Scope this hook to blog post pages only — pass the post's slug
 * (or id) so results are filterable per article in PostHog.
 */
export function useBlogEngagement(postSlug: string) {
  const reachedMilestones = useRef<Set<number>>(new Set());
  const enteredAt = useRef<number>(Date.now());

  useEffect(() => {
    reachedMilestones.current = new Set();
    enteredAt.current = Date.now();

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrolledPercent = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of SCROLL_DEPTH_MILESTONES) {
        if (scrolledPercent >= milestone && !reachedMilestones.current.has(milestone)) {
          reachedMilestones.current.add(milestone);
          trackEvent(ANALYTICS_EVENTS.blogScrollDepth, {
            post_slug: postSlug,
            depth_percent: milestone,
          });
        }
      }
    }

    function handleUnload() {
      const secondsOnPage = Math.round((Date.now() - enteredAt.current) / 1000);
      trackEvent(ANALYTICS_EVENTS.blogTimeOnPage, {
        post_slug: postSlug,
        seconds_on_page: secondsOnPage,
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handleUnload);
      handleUnload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postSlug]);
}
