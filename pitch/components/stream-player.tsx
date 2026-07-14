"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/posthog";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { getCloudinaryVideoUrl, getCloudinaryPosterUrl } from "@/lib/cloudinary";

/**
 * Cloudinary video config.
 *
 * 1. Upload the Thai Terrace video to your Cloudinary account.
 * 2. Grab the Cloud name from your Cloudinary dashboard.
 * 3. Grab the Public ID from the video details page (it looks like "thai-terrace-pitch").
 * 4. Add both to .env.local.
 */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const VIDEO_PUBLIC_ID = process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_PUBLIC_ID;

export function StreamPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasFiredPlayEvent = useRef(false);

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

  // Friendly placeholder while the env vars are missing.
  if (!CLOUD_NAME || !VIDEO_PUBLIC_ID) {
    return (
      <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-black text-center">
        <p className="text-sm font-medium text-white/60">
          Video coming soon
          <span className="mt-1 block text-xs text-white/40">
            Add Cloudinary credentials to .env.local
          </span>
        </p>
      </div>
    );
  }

  const videoUrl = getCloudinaryVideoUrl(VIDEO_PUBLIC_ID, CLOUD_NAME);
  const posterUrl = getCloudinaryPosterUrl(VIDEO_PUBLIC_ID, CLOUD_NAME);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full"
      />
    </div>
  );
}
