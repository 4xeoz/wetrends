"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics/posthog";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

/**
 * Self-hosted video — no third-party video service needed for a single
 * one-off outreach clip. Drop the file at public/videos/thai-terrace-pitch.mp4
 * (same convention the main wetrends.co.uk site uses for its own videos).
 * Optionally drop a matching poster JPG/PNG next to it.
 */
const VIDEO_SRC = "/videos/thai-terrace-pitch.mp4";
const POSTER_SRC = "/videos/thai-terrace-pitch-poster.jpg";

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasFiredPlayEvent = useRef(false);
  const [missing, setMissing] = useState(false);

  const firePlayedOnce = () => {
    if (hasFiredPlayEvent.current) return;
    hasFiredPlayEvent.current = true;
    trackEvent(ANALYTICS_EVENTS.videoPlayed, { client: "thai-terrace" });
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.addEventListener("play", firePlayedOnce);
    return () => el.removeEventListener("play", firePlayedOnce);
  }, []);

  if (missing) {
    return (
      <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-black text-center">
        <p className="text-sm font-medium text-white/60">
          Video coming soon
          <span className="mt-1 block text-xs text-white/40">
            Drop the file at public/videos/thai-terrace-pitch.mp4
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full"
        onError={() => setMissing(true)}
      />
    </div>
  );
}
