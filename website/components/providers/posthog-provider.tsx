"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { capturePageview, initPostHog } from "@/lib/analytics/posthog";

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams.toString();
    const url = query ? `${window.origin}${pathname}?${query}` : `${window.origin}${pathname}`;
    capturePageview(url);
    // Re-fire on every route change — App Router doesn't trigger the SDK's
    // own pageview capture since there's no full page load.
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </>
  );
}
