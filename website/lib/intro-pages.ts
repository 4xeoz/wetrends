import data from "@/lib/intro-recipients.json";
import { siteProfile } from "@/lib/site-profile";

export type IntroRecipient = {
  slug: string;
  devOnly?: boolean;
  firstName: string;
  business: string;
  subject: string;
  headlineAccent: string;
  personalLine: string;
  closingLine: string;
  ctaLabel: string;
  ctaNote: string;
};

export const introVideo = data.video;
export const introSender = data.sender;

const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

/** Returns the recipient for a slug, or null. Dev-only entries never resolve in production. */
export function getIntroRecipient(slug: string): IntroRecipient | null {
  if (!SLUG.test(slug)) return null;
  const found = (data.recipients as IntroRecipient[]).find((r) => r.slug === slug);
  if (!found) return null;
  if (found.devOnly && process.env.NODE_ENV === "production") return null;
  return found;
}

export const introPageUrl = (slug: string, base: string = siteProfile.url) => `${base.replace(/\/$/, "")}/intro/${slug}/`;
export const driveEmbedUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
export const driveOpenUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
