"use client";

import Script from "next/script";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { capturePageview, initPostHog } from "@/lib/analytics/posthog";

/**
 * Routes that are us, not visitors. The admin dashboard and the sign-in page
 * are only ever hit by the people who run the site, so counting them inflates
 * pageviews and pollutes every funnel with internal traffic.
 */
const INTERNAL_ROUTES = ['/me', '/sign-in'];

const CONSENT_KEY = "wetrends_analytics_consent";
type AnalyticsConsent = "granted" | "denied" | null;

function PageviewTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!enabled || !pathname) return;
    if (INTERNAL_ROUTES.some((route) => pathname.startsWith(route))) return;

    const query = searchParams.toString();
    const url = query ? `${window.origin}${pathname}?${query}` : `${window.origin}${pathname}`;
    capturePageview(url);
    // Re-fire on every route change — App Router doesn't trigger the SDK's
    // own pageview capture since there's no full page load.
  }, [enabled, pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<AnalyticsConsent>(null);
  const [ready, setReady] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    setConsent(saved === "granted" || saved === "denied" ? saved : null);
    setReady(true);
  }, []);

  useEffect(() => {
    if (consent !== "granted") return;
    initPostHog();

    if (gaId) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
      window.gtag("js", new Date());
      window.gtag("config", gaId, {
        anonymize_ip: true,
        send_page_view: false,
      });
    }

    capturePageview(window.location.href);
  }, [consent, gaId]);

  const choose = (next: Exclude<AnalyticsConsent, null>) => {
    window.localStorage.setItem(CONSENT_KEY, next);
    setConsent(next);
  };

  return (
    <>
      {consent === "granted" && gaId && (
        <Script
          id="wetrends-ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
          strategy="afterInteractive"
        />
      )}
      <Suspense fallback={null}>
        <PageviewTracker enabled={consent === "granted"} />
      </Suspense>
      {children}
      {ready && consent === null && (
        <aside
          aria-label="Analytics preference"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-white/15 bg-[#0F0F0F] p-5 text-white shadow-2xl sm:flex sm:items-center sm:justify-between sm:gap-6"
        >
          <p className="text-sm leading-relaxed text-white/75">
            We use optional analytics to understand which work brings useful enquiries. Nothing loads until you choose.
          </p>
          <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="rounded-full bg-[#C72C5B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#A3244A]"
            >
              Allow analytics
            </button>
          </div>
        </aside>
      )}
      {ready && consent !== null && (
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem(CONSENT_KEY);
            window.location.reload();
          }}
          className="fixed bottom-3 left-3 z-[90] rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-black/55 shadow-sm backdrop-blur hover:text-black"
        >
          Privacy choices
        </button>
      )}
    </>
  );
}
