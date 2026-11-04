"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { formatMoney } from "@/lib/events/catalog";

type Outcome = "success" | "pending" | "failed" | "closed";

export default function ClientPaymentOutcome({ token, outcome, title, total, reference }: {
  token: string;
  outcome: Outcome;
  title: string;
  total: number;
  reference: string;
}) {
  const reducedMotion = useReducedMotion();
  const success = outcome === "success";
  const pending = outcome === "pending";
  const closed = outcome === "closed";
  const statusLabel = success ? "Payment confirmed" : pending ? "Payment pending confirmation" : closed ? "Request closed" : "Payment not completed";
  const statusClass = success ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200" : pending ? "border-amber-300/30 bg-amber-400/10 text-amber-100" : closed ? "border-white/15 bg-white/5 text-white/70" : "border-[#F28AAA]/30 bg-[#F06991]/10 text-[#FFC0D1]";
  const heading = success ? "Payment complete." : pending ? "We’re checking your payment." : closed ? "This request is closed." : "Payment wasn’t completed.";
  const body = success
    ? "Your payment is confirmed. Thank you; our team will continue with the work you agreed together."
    : pending
      ? "We haven’t confirmed a charge yet. Check again in a moment. If your bank shows a charge, contact us before trying to pay again."
      : closed
        ? "This payment request is no longer active. Contact us for an updated link."
        : "We couldn't complete this attempt. Return to the payment page to try again. If your bank shows a charge, contact us before trying again.";
  return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#171619] px-4 py-12 text-white sm:px-6">
    <div aria-hidden className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#A62C54]/25 blur-3xl" />
    <div aria-hidden className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#6D3A77]/25 blur-3xl" />
    <motion.div initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="relative w-full max-w-2xl rounded-[2rem] border border-white/15 bg-white/[0.07] p-7 text-center shadow-2xl backdrop-blur-md sm:p-12">
      <Link href="/" aria-label="WeTrends home" className="inline-flex rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        <Image src="/images/logo-transparent.svg" alt="WeTrends" width={58} height={39} priority className="mx-auto h-9 w-auto" />
      </Link>
      <motion.p role="status" initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.35, ease: "easeOut" }} className={`mx-auto mt-8 flex w-fit rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${statusClass}`}>
        {statusLabel}
      </motion.p>
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#F28AAA]">{reference}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">{heading}</h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">{body}</p>
      <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-black/15 px-5 py-4 text-left"><p className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">{title}</p><p className="mt-2 text-2xl font-bold">{formatMoney(total, "gbp")}</p></div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {success ? <Link href={`/pay/${token}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white transition hover:bg-[#A3244A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">View payment summary</Link>
          : pending ? <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white transition hover:bg-[#A3244A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Check again</button>
          : !closed ? <Link href={`/pay/${token}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white transition hover:bg-[#A3244A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Try payment again</Link> : null}
        <a href={`mailto:team@wetrends.co.uk?subject=${encodeURIComponent(`Payment ${reference}`)}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Contact the team</a>
      </div>
      <p className="mt-9 text-xs text-white/55">Secure payments powered by Stripe</p>
    </motion.div>
  </main>;
}
