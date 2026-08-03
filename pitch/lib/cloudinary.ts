const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "l1uyp2mb";

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}`;

/**
 * The masters are ~50MB each (80–90s at camera bitrate). Nobody watches a
 * pitch that buffers, so delivery always goes through a transformation:
 * capped at 1080p and ~2.5Mbps, which lands around 7–8MB, and `f_auto` hands
 * Safari/Chrome whatever container they prefer.
 */
export function videoUrl(publicId: string) {
  return `${BASE}/video/upload/q_auto,f_auto,vc_auto,w_1920,c_limit,br_2500k/${publicId}.mp4`;
}

/** Poster frame for the <video> element, pulled straight off the timeline. */
export function posterUrl(publicId: string, timeSeconds: number, width = 1280) {
  return `${BASE}/video/upload/so_${timeSeconds},w_${width},c_limit,q_auto/${publicId}.jpg`;
}
