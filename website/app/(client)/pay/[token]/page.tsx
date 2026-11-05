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

  return <main className="flex min-h-svh flex-col overflow-x-hidden bg-[#171619] text-white">
    <ClientFlowHeader step="welcome" reference={reference} compact />
    <div className="flex flex-1 flex-col">
      <section className="relative isolate shrink-0 overflow-hidden px-4 py-3 sm:px-6 sm:py-5">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#C72C5B]/20 blur-3xl" />
        <div className="wt-client-welcome-enter relative mx-auto max-w-6xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F8B9CB] sm:text-xs">A personal welcome for {payment.clientName}</p>
          <h1 className="mt-2 max-w-5xl text-[clamp(2rem,5svh,4.5rem)] font-black leading-[1.02] tracking-[-0.065em] sm:text-[clamp(2.5rem,6svh,5.5rem)]">Thank you for <span className="font-serif italic text-[#F28AAA]">choosing us.</span></h1>
          <p className="mt-2 max-w-2xl text-sm leading-5 text-white/75 [@media(max-height:600px)]:hidden sm:text-base sm:leading-6">We&apos;re excited to work on {payment.projectTitle} with you. Take a look at our work, then review your offer.</p>
        </div>
      </section>
      <section aria-labelledby="selected-work-heading" className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden border-y border-white/10 bg-[#211B21] py-3 sm:py-4">
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-4 px-4 sm:px-6">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#F8B9CB]"><span aria-hidden="true" className="h-[2px] w-5 bg-[#F28AAA]" />Selected work</p>
            <h2 id="selected-work-heading" className="mt-1 text-xl font-black tracking-[-0.04em] sm:text-2xl">Ideas, in motion.</h2>
          </div>
          <p className="hidden text-xs text-white/60 sm:block">Select a reel to watch with sound</p>
        </div>
        <div className="relative mt-2">
          <ReelWall reels={selectedReels} rows={1} compact duration={44} className="bg-transparent motion-reduce:overflow-x-auto" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-[#211B21] to-transparent sm:w-12" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-[#211B21] to-transparent sm:w-12" />
        </div>
      </section>
      <section className="shrink-0 px-4 py-3 [@media(max-height:600px)]:pb-2 sm:px-6 sm:py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F8B9CB]">Next · Your offer</p>
            <h2 className="mt-1 hidden text-xl font-black tracking-[-0.04em] sm:block">Everything we agreed, clearly laid out.</h2>
          </div>
          <Link href={"/pay/" + token + "/offer"} prefetch={false} className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-white px-9 text-center text-base font-black text-[#171619] shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:bg-[#FCE1E9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-0 sm:w-auto">View your offer</Link>
        </div>
      </section>
    </div>
  </main>;
}
