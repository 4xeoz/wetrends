import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

  return <main className="min-h-screen bg-[#F2EEEB] text-[#171619]">
    <ClientFlowHeader step="offer" reference={reference} />
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href={paid ? "/pay/" + token + "/result" : "/pay/" + token} prefetch={false} className="inline-flex min-h-11 items-center text-sm font-semibold text-[#8B2040] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">{paid ? "Back to payment result" : "Back to welcome"}</Link>
      <div className="mt-7 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B12552]">Step 2 of 3 · Offer review</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-[-0.05em] sm:text-5xl">Your offer, in full.</h1>
        <p className="mt-4 text-base leading-relaxed text-black/60">{paid ? "A summary of the services and total you paid for." : "Please take a moment to check the services and total we agreed together."}</p>
      </div>

      <article aria-labelledby="offer-title" className="mx-auto mt-9 max-w-[850px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_28px_80px_rgba(30,20,24,0.12)] sm:rounded-[1.75rem]">
        <div className="flex flex-wrap items-center justify-between gap-5 bg-[#171619] px-6 py-7 text-white sm:px-10">
          <Image src="/images/logo-transparent.svg" alt="WeTrends" width={58} height={39} className="h-9 w-auto" />
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28AAA]">Project offer</p>
            <p className="mt-1 text-sm font-semibold text-white/70">{reference}</p>
          </div>
        </div>
        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="border-b border-black/10 pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B12552]">Prepared for {payment.clientName}</p>
            <h2 id="offer-title" className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{payment.projectTitle}</h2>
            <div className="mt-7 grid gap-5 text-sm sm:grid-cols-2">
              <div><p className="font-semibold text-black/45">Client</p><p className="mt-1 font-semibold">{payment.clientName}</p></div>
              <div><p className="font-semibold text-black/45">Contact email</p><p className="mt-1 break-all font-semibold">{payment.clientEmail}</p></div>
            </div>
          </div>

          {payment.note && <section aria-labelledby="offer-context-heading" className="border-b border-black/10 py-8">
            <h3 id="offer-context-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-[#B12552]">The agreed context</h3>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-black/70">{payment.note}</p>
          </section>}

          <section aria-labelledby="offer-items-heading" className="pt-8">
            <div className="flex items-end justify-between gap-4 border-b border-black/10 pb-4">
              <h3 id="offer-items-heading" className="text-lg font-bold">Included services</h3>
              <span className="text-xs font-medium text-black/45">Prices in GBP</span>
            </div>
            <div className="divide-y divide-black/10">
              {items.map((item, index) => <div key={index} className="grid gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div>
                  <h4 className="font-bold">{String(index + 1).padStart(2, "0")}. {item.name}</h4>
                  {item.description && <p className="mt-2 text-sm leading-6 text-black/65">{item.description}</p>}
                  <p className="mt-3 text-xs font-semibold text-black/45">Qty {item.quantity} × {formatMoney(item.unitAmount, payment.currency)}</p>
                </div>
                <p className="font-bold sm:text-right">{formatMoney(item.quantity * item.unitAmount, payment.currency)}</p>
              </div>)}
            </div>
            <div className="flex items-center justify-between gap-4 border-t-2 border-[#171619] pt-6">
              <span className="font-bold">{paid ? "Total paid" : "Total to pay"}</span>
              <strong className="text-3xl tracking-tight text-[#8B2040]">{formatMoney(payment.total, payment.currency)}</strong>
            </div>
          </section>
          <p className="mt-9 border-t border-black/10 pt-5 text-xs leading-relaxed text-black/45">Private offer summary · {reference}</p>
        </div>
      </article>

      {!paid && <div className="mx-auto mt-9 max-w-[850px] rounded-[1.75rem] border border-[#C72C5B]/20 bg-white px-6 py-7 shadow-sm sm:px-10">
        <h2 className="text-xl font-bold">Everything look right?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/60">If any detail differs from what you discussed with us, please contact the team before paying.</p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href={"/pay/" + token + "/checkout"} prefetch={false} className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#C72C5B] px-9 text-center text-base font-bold text-white shadow-[0_10px_25px_rgba(199,44,91,0.2)] transition hover:bg-[#A3244A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">Agree and continue</Link>
          <a href={"mailto:team@wetrends.co.uk?subject=" + encodeURIComponent("Offer " + reference)} className="inline-flex min-h-11 items-center text-sm font-semibold text-[#8B2040] underline underline-offset-4">Ask us a question</a>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-black/45">You will enter payment details on the next page. Continuing does not charge your card.</p>
      </div>}
    </div>
  </main>;
}
