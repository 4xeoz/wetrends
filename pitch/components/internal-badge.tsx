"use client";

import { useEffect, useState } from "react";
import { resolveVisit } from "@/lib/analytics/audience";

/**
 * Visible only to us. Two things go wrong without it: someone sends the team
 * link to the client by mistake, and someone reads the PostHog dashboard
 * without realising half the views were their own colleagues. The badge makes
 * the current link's audience obvious before either happens.
 *
 * Renders nothing on the client link from a browser that has never opened a
 * team link — which is every recipient.
 */
export function InternalBadge({ slug }: { slug: string }) {
  const [audience, setAudience] = useState<"team" | null>(null);

  useEffect(() => {
    const visit = resolveVisit(window.location.search, slug);
    if (visit.audience === "team") setAudience("team");
  }, [slug]);

  if (!audience) return null;

  return (
    <div className="fixed bottom-14 left-1/2 z-40 max-w-[92vw] -translate-x-1/2 rounded-2xl border border-amber-300/40 bg-amber-950/85 px-4 py-2 text-center font-mono text-[10px] font-bold uppercase leading-relaxed tracking-[0.18em] text-amber-200 backdrop-blur-md sm:whitespace-nowrap sm:rounded-full">
      Internal view · not the client&apos;s link · tracked as team
    </div>
  );
}
