const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'l1uyp2mb';

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}`;

/**
 * Masters are 1080x1920 and up to ~64MB. Eighteen of those on one page would be
 * absurd, so every reel is requested through a transformation. Two sizes only:
 * a small one for the silent previews playing in the wall, and a full one for
 * the lightbox where sound is on and the user actually chose to watch.
 *
 * The wall plays roughly a dozen of these at once, so it is deliberately
 * starved: 360px wide at 400kbps is around 50KB/s per tile, which is what
 * makes autoplaying the whole grid affordable.
 */
export function reelPreviewUrl(publicId: string) {
  return `${BASE}/video/upload/q_auto,f_auto,vc_auto,w_360,c_limit,br_400k/${publicId}.mp4`;
}

export function reelFullUrl(publicId: string) {
  return `${BASE}/video/upload/q_auto,f_auto,vc_auto,w_1080,c_limit,br_2500k/${publicId}.mp4`;
}

/**
 * Poster frame pulled off the timeline at 1s — frame zero is often a fade-in
 * from black, which makes the whole wall look broken.
 */
export function reelPosterUrl(publicId: string, width = 480) {
  return `${BASE}/video/upload/so_1,w_${width},c_limit,q_auto,f_auto/${publicId}.jpg`;
}
