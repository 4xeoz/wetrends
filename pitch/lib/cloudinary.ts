/**
 * Build a Cloudinary delivery URL for a video asset.
 *
 * Example:
 *   getCloudinaryVideoUrl("thai-terrace-pitch", "wetrends")
 *   // -> https://res.cloudinary.com/wetrends/video/upload/f_auto,q_auto/thai-terrace-pitch
 */
export function getCloudinaryVideoUrl(
  publicId: string,
  cloudName: string,
  transforms: string[] = ["f_auto", "q_auto"]
): string {
  const transformation = transforms.length > 0 ? `${transforms.join(",")}/` : "";
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transformation}${publicId}`;
}

/**
 * Build a Cloudinary poster/thumbnail URL from a video public ID.
 */
export function getCloudinaryPosterUrl(
  publicId: string,
  cloudName: string,
  transforms: string[] = ["f_auto", "q_auto", "w_1280"]
): string {
  const transformation = transforms.length > 0 ? `${transforms.join(",")}/` : "";
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transformation}${publicId}.jpg`;
}
