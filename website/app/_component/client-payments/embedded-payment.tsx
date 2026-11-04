"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type EmbeddedCheckout = { mount: (target: HTMLElement) => void; destroy: () => void };
type StripeBrowser = { createEmbeddedCheckoutPage: (options: { fetchClientSecret: () => Promise<string> }) => Promise<EmbeddedCheckout> };
declare global { interface Window { Stripe?: (key: string) => StripeBrowser } }

let stripeScriptPromise: Promise<void> | null = null;
function loadStripeScript() {
  if (window.Stripe) return Promise.resolve();
  stripeScriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => window.Stripe ? resolve() : reject(new Error("Stripe could not be loaded."));
    script.onerror = () => reject(new Error("Stripe could not be loaded."));
    document.head.appendChild(script);
  }).catch((error) => { stripeScriptPromise = null; throw error; });
  return stripeScriptPromise;
}

export default function EmbeddedClientPayment({ token, publishableKey }: { token: string; publishableKey: string }) {
  const router = useRouter();
  const targetRef = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let checkout: EmbeddedCheckout | null = null;
    setReady(false);
    setError("");
    async function mount() {
      try {
        const response = await fetch(`/api/pay/${token}/checkout`, { method: "POST", cache: "no-store" });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not open secure payment.");
        if (result.paid) { if (active) router.replace(`/pay/${token}/result`); return; }
        const clientSecret = result.clientSecret;
        if (typeof clientSecret !== "string") throw new Error("Could not open secure payment.");
        await loadStripeScript();
        if (!active || !targetRef.current || !window.Stripe) return;
        checkout = await window.Stripe(publishableKey).createEmbeddedCheckoutPage({ fetchClientSecret: async () => clientSecret });
        if (!active || !targetRef.current) { checkout.destroy(); return; }
        checkout.mount(targetRef.current);
        setReady(true);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Could not open secure payment.");
      }
    }
    void mount();
    return () => { active = false; checkout?.destroy(); };
  }, [token, publishableKey, router, attempt]);

  return <div className="min-h-[22rem]">
    <div className="mb-5 text-sm font-semibold text-[#272727]">Secure card payment by Stripe</div>
    {!ready && !error && <div role="status" className="flex min-h-64 items-center justify-center gap-3 rounded-2xl bg-[#F8F6F5] text-sm font-medium text-black/60"><span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-[#C72C5B]/20 border-t-[#C72C5B]" /> Preparing your secure form…</div>}
    <div ref={targetRef} className="w-full" />
    {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
      <p className="font-semibold">Payment form unavailable</p><p className="mt-2 leading-relaxed">{error}</p>
      <button type="button" onClick={() => setAttempt((current) => current + 1)} className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#C72C5B] px-5 font-bold text-white transition hover:bg-[#A3244A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">Try again</button>
    </div>}
    <p className="mt-5 text-xs leading-relaxed text-black/45">Your card details are entered directly into Stripe&apos;s secure form. WeTrends does not receive your full card number.</p>
  </div>;
}
