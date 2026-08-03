/**
 * Central registry of tracked events.
 * Add a new event here (one line) then call `trackEvent("your_event", {...})` anywhere in the app.
 *
 * Every event on a pitch page also carries the super properties registered by
 * `PitchTracker` — `pitch_client`, `audience`, `link_variant`, `ref` — so any
 * chart below can be split by "was this the client or one of us?".
 */
export const ANALYTICS_EVENTS = {
  videoPlayed: "video_played",
  videoProgressed: "video_progressed",
  videoCompleted: "video_completed",
  emailPitchLinkClicked: "email_pitch_link_clicked",
  pitchCtaClicked: "pitch_cta_clicked",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsEventProperties = Record<string, string | number | boolean | null | undefined>;
