/**
 * Every pitch page is handed out as two different links to the same page:
 *
 *   client link →  /sequoia-yoga?ref=sequoia-yoga-client&aud=client
 *   team link   →  /sequoia-yoga?ref=sequoia-yoga-team&aud=team
 *
 * Only the first one is ever typed into a recipient's inbox. The second is the
 * one we paste in Slack, forward internally, or send when the client passes the
 * video to a colleague. Because the two links carry different `ref` values,
 * PostHog builds two separate person profiles per client, so "the owner watched
 * it twice" and "three of us previewed it" never end up in the same number.
 *
 * `ref` is deliberately an opaque slug rather than the recipient's email
 * address — a real email in an outreach URL has the same technical signature
 * as a spear-phishing tracking link and gets flagged as one.
 */
export const PITCH_AUDIENCES = ["client", "team", "unknown"] as const;

export type PitchAudience = (typeof PITCH_AUDIENCES)[number];

/** Which of the two links this page was reached through. */
export type PitchLinkVariant = Exclude<PitchAudience, "unknown">;

/**
 * Set the first time a browser follows a team link, and never cleared. It means
 * a colleague who previewed the page in the morning is still reported as
 * internal if they open the client link that afternoon — otherwise their visit
 * would land on the client's profile and inflate it.
 */
const INTERNAL_DEVICE_KEY = "wt_pitch_internal_device";

export function refFor(slug: string, variant: PitchLinkVariant) {
  return `${slug}-${variant}`;
}

/**
 * Builds the exact URL that goes in each email. Kept here (rather than typed by
 * hand into the templates) so the links and the code reading them can't drift.
 */
export function pitchLink(baseUrl: string, slug: string, variant: PitchLinkVariant) {
  const url = new URL(`/${slug}`, baseUrl);
  url.searchParams.set("ref", refFor(slug, variant));
  url.searchParams.set("aud", variant);
  url.searchParams.set("utm_source", variant === "client" ? "email" : "internal");
  url.searchParams.set("utm_medium", "video-pitch");
  url.searchParams.set("utm_campaign", slug);
  return url.toString();
}

function isVariant(value: string | null): value is PitchLinkVariant {
  return value === "client" || value === "team";
}

export function markInternalDevice() {
  try {
    window.localStorage.setItem(INTERNAL_DEVICE_KEY, "1");
  } catch {
    // Private mode / storage disabled — we just lose the stickiness.
  }
}

export function isInternalDevice() {
  try {
    return window.localStorage.getItem(INTERNAL_DEVICE_KEY) === "1";
  } catch {
    return false;
  }
}

export type ResolvedVisit = {
  /** Who we believe is looking at the page. */
  audience: PitchAudience;
  /** The link actually followed, before the internal-device override. */
  linkVariant: PitchLinkVariant | null;
  /** PostHog distinct id for this visit, or null when there's nothing to identify. */
  ref: string | null;
  /** True when this browser has ever followed a team link. */
  internalDevice: boolean;
  utmSource: string | null;
  utmCampaign: string | null;
};

/**
 * Reads the URL and this browser's history and decides which of the three
 * audiences the visit belongs to.
 *
 * A link with no `ref` at all (someone forwarded the bare URL, or it was pasted
 * into a group chat) resolves to `unknown` rather than being folded into the
 * client's numbers — a watch we can't attribute is worth less than a watch we
 * can, and pretending otherwise is the whole failure mode this is meant to
 * avoid.
 */
export function resolveVisit(search: string, slug: string): ResolvedVisit {
  const params = new URLSearchParams(search);
  const rawRef = params.get("ref");
  const rawAud = params.get("aud");

  // `aud` is authoritative; `ref` suffix is the fallback for older links that
  // only carried a ref.
  let linkVariant: PitchLinkVariant | null = null;
  if (isVariant(rawAud)) {
    linkVariant = rawAud;
  } else if (rawRef?.endsWith("-team")) {
    linkVariant = "team";
  } else if (rawRef?.endsWith("-client")) {
    linkVariant = "client";
  }

  if (linkVariant === "team") {
    markInternalDevice();
  }

  const internalDevice = isInternalDevice();

  // A known-internal browser is reported as internal whatever link it followed.
  const audience: PitchAudience = internalDevice ? "team" : (linkVariant ?? "unknown");

  let ref = rawRef;
  if (!ref && linkVariant) ref = refFor(slug, linkVariant);
  if (internalDevice && audience === "team" && linkVariant !== "team") {
    // Followed the client link on an internal browser — keep them on the team
    // profile rather than merging into the client's.
    ref = refFor(slug, "team");
  }

  return {
    audience,
    linkVariant,
    ref,
    internalDevice,
    utmSource: params.get("utm_source"),
    utmCampaign: params.get("utm_campaign"),
  };
}
