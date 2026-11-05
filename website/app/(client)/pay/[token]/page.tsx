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

const selectedReels = reels.slice(0, 6);

export default async function ClientWelcomePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payment = await getClientPaymentFromToken(token);
  if (!payment) notFound();
  if (payment.status !== "OPEN") redirect("/pay/" + token + "/result");
  const reference = paymentReference(payment.id);

  return <main className="flex min-h-svh flex-col overflow-x-hidden bg-[#F3F0EA] text-[#1B1819]">
    <ClientFlowHeader step="welcome" reference={reference} compact />
    <div className="mx-auto grid w-full max-w-[1480px] flex-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
      <section className="flex flex-col justify-center px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:py-12 lg:pl-12 lg:pr-10 xl:pl-16 xl:pr-16">
        <div className="wt-client-welcome-enter">
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#A52249] sm:text-xs"><span aria-hidden="true" className="h-px w-8 bg-[#A52249]" />A private welcome</p>
          <p className="mt-4 text-sm font-semibold tracking-[-0.01em] text-[#1B1819]/65 sm:text-base">For {payment.clientName}</p>
        </div>
        <h1 className="wt-client-welcome-enter mt-9 max-w-3xl text-[clamp(3.3rem,8vw,7rem)] font-semibold leading-[0.89] tracking-[-0.075em] sm:mt-11 lg:text-[clamp(4.5rem,6.6vw,7.5rem)]" style={{ animationDelay: "90ms" }}>Let&apos;s make it<br /><span className="font-serif font-normal italic tracking-[-0.065em] text-[#A52249]">matter.</span></h1>
        <p className="wt-client-welcome-enter mt-7 max-w-xl text-base leading-7 text-[#1B1819]/70 sm:mt-9 sm:text-lg sm:leading-8" style={{ animationDelay: "170ms" }}>Thank you for choosing us. We&apos;re looking forward to bringing <span className="font-semibold text-[#1B1819]">{payment.projectTitle}</span> to life with you.</p>
        <div className="wt-client-welcome-enter mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-11" style={{ animationDelay: "250ms" }}>
          <Link href={"/pay/" + token + "/offer"} prefetch={false} className="inline-flex min-h-14 w-full items-center justify-center bg-[#1B1819] px-9 text-center text-sm font-bold uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-1 hover:bg-[#A52249] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A52249] active:translate-y-0 sm:w-auto">View your offer</Link>
          <p className="text-xs leading-5 text-[#1B1819]/55">Next: everything we agreed, clearly laid out.</p>
        </div>
      </section>
      <section aria-labelledby="selected-work-heading" className="wt-client-showcase-enter relative isolate mx-5 mb-5 flex min-h-[420px] flex-col justify-between overflow-hidden bg-[#21191C] py-6 text-white sm:mx-8 sm:mb-8 sm:min-h-[480px] sm:py-8 lg:mx-0 lg:my-6 lg:mr-8 lg:min-h-[500px] xl:mr-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#8C2949]/30 blur-3xl" />
        <div className="relative flex items-center justify-between gap-4 px-6 sm:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#EDB8C7]">From our studio</p>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-white/45">01 — {String(selectedReels.length).padStart(2, "0")}</p>
        </div>
        <div className="relative my-8 sm:my-7">
          <ReelWall reels={selectedReels} rows={1} duration={39} className="bg-transparent motion-reduce:overflow-x-auto" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#21191C] to-transparent sm:w-10" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#21191C] to-transparent sm:w-10" />
        </div>
        <div className="relative flex flex-wrap items-end justify-between gap-3 px-6 sm:px-8">
          <h2 id="selected-work-heading" className="font-serif text-3xl font-normal italic tracking-[-0.04em] sm:text-4xl">Made to move.</h2>
          <p className="text-xs text-white/55">Select a reel to watch.</p>
        </div>
      </section>
    </div>
  </main>;
}
