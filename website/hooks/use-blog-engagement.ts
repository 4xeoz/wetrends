"use client";

import { useEffect, useRef } from "react";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/posthog";

/**
 * Two milestones, not four. 25% is reached by anyone who scrolls at all, so it
 * measures nothing; 100% is often unreachable behind a tall footer. "Read half"
 * and "read to the end" are the two answers worth having, and they halve the
 * event volume per reader.
 */
const SCROLL_DEPTH_MILESTONES = [50, 90];

/** Below this, a visit is a bounce rather than a read worth recording. */
const MIN_REPORTABLE_SECONDS = 10;

/**
 * Tracks how far into a post a reader gets, and how long they stayed. Scope this
 * to blog post pages and pass the slug so results are filterable per article.
 */
export function useBlogEngagement(postSlug: string) {
  const reachedMilestones = useRef<Set<number>>(new Set());
  const enteredAt = useRef<number>(Date.now());
  const hasReportedTime = useRef(false);

  useEffect(() => {
    reachedMilestones.current = new Set();
    enteredAt.current = Date.now();
    hasReportedTime.current = false;

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

    /**
     * Reports at most once per visit. Previously this ran on `pagehide` *and*
     * again from the cleanup below, so closing a tab double-counted every read;
     * and it fired for two-second bounces, which is not time-on-page data.
     */
    function reportTimeOnPage() {
      if (hasReportedTime.current) return;

      const secondsOnPage = Math.round((Date.now() - enteredAt.current) / 1000);
      if (secondsOnPage < MIN_REPORTABLE_SECONDS) return;

      hasReportedTime.current = true;
      trackEvent(ANALYTICS_EVENTS.blogTimeOnPage, {
        post_slug: postSlug,
        seconds_on_page: secondsOnPage,
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", reportTimeOnPage);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", reportTimeOnPage);
      reportTimeOnPage();
    };
  }, [postSlug]);
}
