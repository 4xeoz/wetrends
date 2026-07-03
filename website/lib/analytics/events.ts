/**
 * Central registry of tracked conversion events.
 * Add a new event here (one line) then call `trackEvent("your_event", {...})` anywhere in the app.
 */
export const ANALYTICS_EVENTS = {
  contactFormStarted: "contact_form_started",
  contactFormSubmitted: "contact_form_submitted",
  bookingStarted: "cinematography_booking_started",
  bookingCompleted: "cinematography_booking_completed",
  ctaClicked: "cta_clicked",
  newsletterSignup: "newsletter_signup",
  blogScrollDepth: "blog_scroll_depth",
  blogTimeOnPage: "blog_time_on_page",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export type AnalyticsEventProperties = Record<string, string | number | boolean | null | undefined>;
