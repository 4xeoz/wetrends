/**
 * Central registry of tracked events.
 * Add a new event here (one line) then call `trackEvent("your_event", {...})` anywhere in the app.
 */
export const ANALYTICS_EVENTS = {
  videoPlayed: "video_played",
  emailPitchLinkClicked: "email_pitch_link_clicked",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsEventProperties = Record<string, string | number | boolean | null | undefined>;
