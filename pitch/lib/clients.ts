/**
 * Every pitch page is one entry in this registry. Adding a client is a config
 * change, not a new page — `app/[client]/page.tsx` renders all of them and
 * `generateStaticParams` prerenders one route per slug.
 *
 * `video` is a Cloudinary public id (with its version prefix). The player and
 * the emailed thumbnail are both derived from it, so a client is never
 * half-wired to one video and half to another.
 */
export type PitchClient = {
  /** URL slug — also the PostHog `pitch_client` property and the ref prefix. */
  slug: string;
  /** Legal/trading name, used in copy and the email subject lines. */
  businessName: string;
  /** Short name for the big hero headline and the intro title card. */
  displayName: string;
  /** Who the video actually addresses, if a named person. */
  contactFirstName?: string;
  /** <title> for the page. */
  metaTitle: string;
  /** Line under the hero headline. */
  subhead: string;
  /** Cloudinary public id, with the `vNNNN/` version prefix when we have one. */
  video: string;
  /** Seconds into the video used for the poster frame + email thumbnail. */
  posterTime: number;
  /** Scrolling strip along the bottom. */
  marqueeItems: string[];
  /** Colour system for this page. */
  theme: {
    /** Accent — headline serif, CTA text, intro title card. */
    accent: string;
    /** Deep shade of the accent, used for tints, shadows and the vignette. */
    shade: string;
  };
};

export const PITCH_CLIENTS: PitchClient[] = [
  {
    slug: "sequoia-yoga",
    businessName: "Sequoia Yoga",
    displayName: "Sequoia",
    contactFirstName: "Loni",
    metaTitle: "Hey Loni — a quick word from WeTrends",
    subhead:
      "Eighty seconds on how the people already searching for yoga in Guildford end up booking a first class with you.",
    video: "v1785189827/sequoia_pillaties_heguin",
    // Lands on the "150,000" caption — the number the video opens on.
    posterTime: 3.6,
    marqueeItems: [
      "Made for Sequoia Yoga",
      "From WeTrends in Guildford",
      "Yoga · Pilates · Qi Gong",
      "Reply if it lands",
    ],
    theme: { accent: "#5E8B5A", shade: "#16301A" },
  },
  {
    slug: "lighting-centre",
    businessName: "The Lighting Centre, Guildford",
    displayName: "The Lighting Centre",
    metaTitle: "Hey Lighting Centre — a quick word from WeTrends",
    subhead:
      "Ninety seconds on getting Guildford's 55,760 households into the Woodbridge Road showroom before they default to a search result.",
    video: "v1785189844/lighing_electric_q35ine",
    // Lands on the "has 55,760" caption — Guildford's household count.
    posterTime: 3.6,
    marqueeItems: [
      "Made for The Lighting Centre",
      "From WeTrends in Guildford",
      "On Woodbridge Road since 1985",
      "Reply if it lands",
    ],
    theme: { accent: "#D9A441", shade: "#2B1D06" },
  },
  {
    slug: "maki-and-ramen",
    businessName: "Maki & Ramen, Southampton",
    displayName: "Maki & Ramen",
    metaTitle: "Hey Maki & Ramen — a quick word from WeTrends",
    subhead:
      "Eighty seconds on filling the Southampton room — including the case study we're least proud of.",
    video: "v1785189838/makiandramen_fosjjs",
    // Lands on the "42,000" caption — Southampton's 18–24 population.
    posterTime: 21.7,
    marqueeItems: [
      "Made for Maki & Ramen Southampton",
      "From WeTrends in Guildford",
      "One store, one clear goal",
      "Reply if it lands",
    ],
    theme: { accent: "#C7332F", shade: "#2E0A09" },
  },
  {
    slug: "thai-terrace",
    businessName: "The Thai Terrace",
    displayName: "Thai Terrace",
    metaTitle: "Hey Thai Terrace — a quick word from WeTrends",
    subhead: "Made this for you in a few minutes — take a look and let me know what you think.",
    video: "Nested_Sequence_02_1_vyipul",
    posterTime: 2,
    marqueeItems: [
      "Made for The Thai Terrace",
      "From WeTrends in Guildford",
      "One video, no strings",
      "Reply if you like it",
    ],
    theme: { accent: "#C72C5B", shade: "#400b1a" },
  },
  {
    slug: "fitness-space",
    businessName: "Fitness Space",
    displayName: "Fitness Space",
    metaTitle: "Hey Fitness Space — a quick word from WeTrends",
    subhead:
      "Seventy-eight seconds on turning the Woking opening film into something Wimbledon — and every club after it — can run too.",
    video: "v1785480421/Sequence_01_1_iruhfu",
    // Lands on the "Woking." caption, over the club's own opening footage —
    // the thumbnail should read as their gym, not as a man at a desk.
    posterTime: 6,
    marqueeItems: [
      "Made for Fitness Space",
      "From WeTrends in Guildford",
      "Woking · Wimbledon",
      "Reply if it lands",
    ],
    // Their identity is black-and-white with one teal accent (sampled off the
    // arrow mark on fitness-space.co.uk, lifted so it still reads as a glow
    // against the near-black shade).
    theme: { accent: "#4F9C97", shade: "#0B1D1C" },
  },
];

export function getPitchClient(slug: string): PitchClient | undefined {
  return PITCH_CLIENTS.find((c) => c.slug === slug);
}
