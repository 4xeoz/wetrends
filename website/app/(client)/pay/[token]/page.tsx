import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getClientPaymentFromToken } from "@/lib/client-payments/access";
import { paymentReference } from "@/lib/client-payments/policy";
import { reels } from "@/lib/reels-data";
import ClientFlowHeader from "@/app/_component/client-payments/client-flow-header";
import ReelWall from "@/components/reels/reel-wall";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Welcome | WeTrends",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

const selectedReels = reels.slice(0, 12);

export default async function ClientWelcomePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payment = await getClientPaymentFromToken(token);
  if (!payment) notFound();
  if (payment.status !== "OPEN") redirect("/pay/" + token + "/result");
  const reference = paymentReference(payment.id);

  return <main className="flex min-h-svh flex-col overflow-x-hidden bg-[#F7F4F2] text-[#171619]">
    <ClientFlowHeader step="welcome" reference={reference} compact />
    <div className="flex flex-1 flex-col">
      <section className="relative isolate shrink-0 overflow-hidden bg-[#171619] px-4 py-3 text-white sm:px-6 sm:py-5">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#C72C5B]/25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F28AAA] sm:text-xs">A private welcome for {payment.clientName}</p>
          <h1 className="mt-2 max-w-4xl text-[clamp(2rem,5svh,4.5rem)] font-bold leading-[1.02] tracking-[-0.06em]">Thank you for <span className="font-serif italic text-[#F28AAA]">choosing us.</span></h1>
          <p className="mt-2 max-w-2xl text-sm leading-5 text-white/70 sm:text-base sm:leading-6">We&apos;re excited to work on {payment.projectTitle} with you. Explore a few reels, then review your offer.</p>
        </div>
      </section>
      <section aria-labelledby="selected-work-heading" className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden bg-[#F7F4F2] py-3 sm:py-4">
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-4 px-4 sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B12552]">Selected work</p>
            <h2 id="selected-work-heading" className="mt-1 text-xl font-bold tracking-[-0.04em] sm:text-2xl">A glimpse of what we do.</h2>
          </div>
          <p className="hidden text-xs text-black/55 sm:block">Select a reel to watch with sound</p>
        </div>
        <ReelWall reels={selectedReels} rows={1} compact duration={44} className="mt-3 bg-transparent motion-reduce:overflow-x-auto" />
      </section>
      <section className="shrink-0 border-t border-black/10 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B12552]">Next · Your offer</p>
            <h2 className="mt-1 hidden text-xl font-bold tracking-[-0.04em] sm:block">See the services and total we agreed.</h2>
          </div>
          <Link href={"/pay/" + token + "/offer"} prefetch={false} className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#C72C5B] px-9 text-center text-base font-bold text-white shadow-[0_10px_25px_rgba(199,44,91,0.2)] transition hover:bg-[#A3244A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B] sm:w-auto">View your offer</Link>
        </div>
      </section>
    </div>
  </main>;
}
