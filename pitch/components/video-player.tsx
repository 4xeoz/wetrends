"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/posthog";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

/**
 * Watch depth, not just "pressed play". Whether the owner got as far as the
 * ask at the end is the signal worth having — a 4% play-to-25% drop tells you
 * the opening line is wrong, and no email open rate ever tells you that.
 */
const MILESTONES = [25, 50, 75] as const;

export function VideoPlayer({
  src,
  poster,
  client,
}: {
  src: string;
  poster: string;
  client: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fired = useRef(new Set<string>());

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const once = (key: string, fire: () => void) => {
      if (fired.current.has(key)) return;
      fired.current.add(key);
      fire();
    };

    const onPlay = () =>
      once("play", () => trackEvent(ANALYTICS_EVENTS.videoPlayed, { client }));

    const onTimeUpdate = () => {
      if (!el.duration) return;
      const percent = (el.currentTime / el.duration) * 100;
      for (const m of MILESTONES) {
        if (percent >= m) {
          once(`p${m}`, () =>
            trackEvent(ANALYTICS_EVENTS.videoProgressed, { client, percent: m }),
          );
        }
      }
    };

    const onEnded = () =>
      once("ended", () => trackEvent(ANALYTICS_EVENTS.videoCompleted, { client }));

    el.addEventListener("play", onPlay);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("ended", onEnded);
    };
  }, [client]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full"
      />
    </div>
  );
}
