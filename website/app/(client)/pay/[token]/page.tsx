import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getClientPaymentFromToken } from "@/lib/client-payments/access";
import { paymentReference } from "@/lib/client-payments/policy";
import { reels } from "@/lib/reels-data";
import { reelPosterUrl, reelPreviewUrl } from "@/lib/cloudinary";
import ClientFlowHeader from "@/app/_component/client-payments/client-flow-header";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Welcome | WeTrends",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

const selectedReels = reels.slice(0, 3);

export default async function ClientWelcomePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payment = await getClientPaymentFromToken(token);
  if (!payment) notFound();
  if (payment.status !== "OPEN") redirect("/pay/" + token + "/result");
  const reference = paymentReference(payment.id);

  return <main className="min-h-screen bg-[#F7F4F2] text-[#171619]">
    <ClientFlowHeader step="welcome" reference={reference} />
    <section className="relative isolate overflow-hidden bg-[#171619] px-4 pb-16 pt-7 text-white sm:px-6 sm:pb-20 sm:pt-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#C72C5B]/25 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28AAA]">A private welcome for {payment.clientName}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.06em] sm:text-6xl lg:text-7xl">Thank you for <span className="font-serif italic text-[#F28AAA]">choosing us.</span></h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">We&apos;re excited to work with you on {payment.projectTitle}. Before you review your offer, here is a glimpse of the work we create.</p>
      </div>
    </section>
    <section aria-labelledby="selected-work-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B12552]">Selected work</p>
        <h2 id="selected-work-heading" className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">A little look at what we do.</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/60">Play a reel to see some of our creative work.</p>
      </div>
      <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {selectedReels.map((reel, index) => <figure key={reel.id} className="w-[min(68vw,17rem)] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-[0_18px_55px_rgba(30,20,24,0.08)] sm:w-auto">
          <video src={reelPreviewUrl(reel.id)} poster={reelPosterUrl(reel.id, 720)} controls playsInline preload="none" aria-label={"Play selected portfolio reel " + (index + 1)} className="aspect-[9/16] w-full bg-[#171619] object-cover" />
          <figcaption className="px-4 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#8B2040]">Selected reel {String(index + 1).padStart(2, "0")}</figcaption>
        </figure>)}
      </div>
    </section>
    <section className="border-t border-black/10 bg-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B12552]">Next · Your offer</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Ready to see what&apos;s included?</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/60">Review your agreed services and total in one clear document before moving to payment.</p>
        </div>
        <Link href={"/pay/" + token + "/offer"} prefetch={false} className="inline-flex min-h-16 shrink-0 items-center justify-center rounded-full bg-[#C72C5B] px-10 text-center text-base font-bold text-white shadow-[0_12px_30px_rgba(199,44,91,0.2)] transition hover:bg-[#A3244A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">View your offer</Link>
      </div>
    </section>
    <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-black/50 sm:px-6">Private request · {reference}</footer>
  </main>;
}
