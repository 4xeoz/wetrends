import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getClientPaymentFromToken } from "@/lib/client-payments/access";
import { paymentItemsFromJson, paymentReference } from "@/lib/client-payments/policy";
import { formatMoney } from "@/lib/events/catalog";
import ClientFlowHeader from "@/app/_component/client-payments/client-flow-header";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your offer | WeTrends",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default async function ClientOfferPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payment = await getClientPaymentFromToken(token);
  if (!payment) notFound();
  if (payment.status === "VOID") redirect("/pay/" + token + "/result");
  const paid = payment.status === "PAID";
  const items = paymentItemsFromJson(payment.items);
  if (!items || items.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0) !== payment.total)
    throw new Error("Payment request items do not match the total");
  const reference = paymentReference(payment.id);

  const total = formatMoney(payment.total, payment.currency);

  return <main className="min-h-svh overflow-x-hidden bg-[#F7F1F3] text-[#21191D]" style={{ backgroundImage: "url('/images/events-mesh-light.png')", backgroundPosition: "center top", backgroundSize: "cover" }}>
    <ClientFlowHeader step="offer" reference={reference} />
    <div className={`mx-auto grid w-full max-w-[1320px] gap-7 px-4 pt-7 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,21rem)] ${paid ? "pb-12 sm:pb-16" : "pb-32 sm:pb-16"}`}>
      <div className="min-w-0">
        <Link href={paid ? "/pay/" + token + "/result" : "/pay/" + token} prefetch={false} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#7E1C3A] transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]"><ArrowLeft aria-hidden="true" className="h-4 w-4" />{paid ? "Payment result" : "Welcome"}</Link>
        <section className="wt-client-welcome-enter mt-6 px-1 sm:mt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A52249] sm:text-xs">Step 2 · Offer review</p>
          <h1 className="mt-3 max-w-3xl text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.065em]">Your offer,<br /><span className="font-serif font-normal italic text-[#A52249]">clearly laid out.</span></h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[#21191D]/65 sm:text-base">{paid ? "Your paid services and project total." : "Your services, scope and total in one place."}</p>
        </section>

        <article aria-labelledby="offer-title" className="wt-client-showcase-enter mt-7 overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/95 shadow-[0_26px_80px_rgba(64,11,26,.14)] backdrop-blur-xl sm:mt-9 sm:rounded-[2rem]">
          <div className="relative overflow-hidden bg-[#21191D] px-5 py-6 text-white sm:px-9 sm:py-8" style={{ backgroundImage: "linear-gradient(115deg, rgba(33,25,29,.90), rgba(103,25,52,.72)), url('/images/events-mesh-dark.png')", backgroundPosition: "center", backgroundSize: "cover" }}>
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full bg-[#C72C5B]/30 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#F2B6C8]">Project offer</p>
                <p className="mt-1 text-sm font-semibold text-white/75">{reference}</p>
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.11em] text-white/80">{paid ? "Paid" : "Prepared for you"}</span>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-9 sm:py-9">
            <div className="border-b border-[#21191D]/10 pb-6 sm:pb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#A52249]">Prepared for {payment.clientName}</p>
              <h2 id="offer-title" className="mt-3 break-words text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{payment.projectTitle}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-5">
                <div className="rounded-2xl bg-[#F8F3F4] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/45">Client</p>
                  <p className="mt-1 text-sm font-semibold">{payment.clientName}</p>
                </div>
                <div className="rounded-2xl bg-[#F8F3F4] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/45">Email</p>
                  <p className="mt-1 break-all text-sm font-semibold">{payment.clientEmail}</p>
                </div>
              </div>
            </div>

            {payment.note && <section aria-labelledby="offer-context-heading" className="border-b border-[#21191D]/10 py-6 sm:py-8">
              <h3 id="offer-context-heading" className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#A52249]">The agreement</h3>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#21191D]/75">{payment.note}</p>
            </section>}

            <section aria-labelledby="offer-items-heading" className="pt-6 sm:pt-8">
              <div className="flex items-end justify-between gap-3 border-b border-[#21191D]/10 pb-4">
                <h3 id="offer-items-heading" className="text-lg font-bold tracking-tight">Included services</h3>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.11em] text-black/45">GBP</span>
              </div>
              <ol className="divide-y divide-[#21191D]/10">
                {items.map((item, index) => <li key={index} className="grid gap-3 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6 sm:py-6">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-0.5 shrink-0 font-serif text-sm italic text-[#A52249]">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <h4 className="break-words text-base font-bold">{item.name}</h4>
                        {item.description && <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#21191D]/65">{item.description}</p>}
                        <p className="mt-3 text-xs font-semibold text-black/45">{item.quantity} × {formatMoney(item.unitAmount, payment.currency)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="pl-7 text-base font-bold sm:pl-0 sm:text-right">{formatMoney(item.quantity * item.unitAmount, payment.currency)}</p>
                </li>)}
              </ol>
              <div className="mt-2 flex items-end justify-between gap-4 rounded-2xl bg-[#F8F3F4] px-4 py-4 sm:px-5 sm:py-5">
                <span className="text-sm font-bold">{paid ? "Total paid" : "Total to pay"}</span>
                <strong className="shrink-0 text-2xl font-bold tracking-tight text-[#8B2040] sm:text-3xl">{total}</strong>
              </div>
            </section>
          </div>
        </article>

        <a href={"mailto:team@wetrends.co.uk?subject=" + encodeURIComponent("Offer " + reference)} className="mt-5 inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-[#7E1C3A] underline decoration-[#A52249]/35 underline-offset-4 transition hover:bg-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Ask us a question</a>
      </div>

      <aside aria-label="Payment summary" className={paid ? "h-fit rounded-[1.6rem] border border-white/80 bg-white/95 p-5 shadow-[0_18px_50px_rgba(64,11,26,.10)] backdrop-blur-xl sm:p-7 lg:sticky lg:top-6" : "fixed inset-x-0 bottom-0 z-30 border-t border-[#21191D]/10 bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-14px_48px_rgba(33,25,29,.14)] backdrop-blur-xl lg:sticky lg:top-6 lg:z-auto lg:h-fit lg:rounded-[1.6rem] lg:border lg:p-7 lg:shadow-[0_18px_50px_rgba(64,11,26,.10)]"}>
        <div className="hidden lg:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A52249]">{paid ? "Payment complete" : "Payment summary"}</p>
          <p className="mt-3 text-sm text-[#21191D]/60">{items.length} {items.length === 1 ? "agreed item" : "agreed items"}</p>
          <p className="mt-2 text-4xl font-semibold tracking-[-0.055em] text-[#21191D]">{total}</p>
          <p className="mt-2 text-xs text-[#21191D]/55">{paid ? "Paid for this project." : "Nothing is charged on this page."}</p>
          {paid ? <Link href={"/pay/" + token + "/result"} prefetch={false} className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#A52249] px-5 text-center text-sm font-bold text-white transition hover:bg-[#7E1C3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">View payment result</Link> : <Link href={"/pay/" + token + "/checkout"} prefetch={false} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#A52249] px-5 text-center text-sm font-bold text-white shadow-[0_10px_25px_rgba(165,34,73,.2)] transition hover:-translate-y-0.5 hover:bg-[#7E1C3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249]">Agree and continue <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>}
          {!paid && <p className="mt-4 text-center text-xs leading-5 text-[#21191D]/50">This acknowledges the agreed offer and continues to secure payment.</p>}
        </div>
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#8B2040]">{paid ? "Total paid" : "Total to pay"}</p>
            <p className="mt-0.5 truncate text-xl font-bold tracking-tight text-[#21191D]">{total}</p>
          </div>
          <Link href={paid ? "/pay/" + token + "/result" : "/pay/" + token + "/checkout"} prefetch={false} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-1 rounded-full bg-[#A52249] px-4 text-xs font-bold text-white transition active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A52249] sm:px-6 sm:text-sm">{paid ? "View result" : "Agree and continue"}<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
        </div>
      </aside>
    </div>
  </main>;
}
