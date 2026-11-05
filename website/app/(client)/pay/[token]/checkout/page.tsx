import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getClientPaymentFromToken } from "@/lib/client-payments/access";
import { paymentItemsFromJson, paymentReference } from "@/lib/client-payments/policy";
import { formatMoney } from "@/lib/events/catalog";
import ClientFlowHeader from "@/app/_component/client-payments/client-flow-header";
import EmbeddedClientPayment from "@/app/_component/client-payments/embedded-payment";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Secure payment | WeTrends",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default async function ClientCheckoutPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payment = await getClientPaymentFromToken(token);
  if (!payment) notFound();
  if (payment.status !== "OPEN") redirect("/pay/" + token + "/result");
  const items = paymentItemsFromJson(payment.items);
  if (!items || items.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0) !== payment.total)
    throw new Error("Payment request items do not match the total");
  const reference = paymentReference(payment.id);
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  return <main className="min-h-screen bg-[#F7F4F2] text-[#151515]">
    <ClientFlowHeader step="payment" reference={reference} />
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-12">
      <section aria-labelledby="checkout-summary-heading" className="self-start">
        <Link href={"/pay/" + token + "/offer"} prefetch={false} className="inline-flex min-h-11 items-center text-sm font-semibold text-[#8B2040] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">Review the offer</Link>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#B12552]">Step 3 of 3 · Secure payment</p>
        <h1 id="checkout-summary-heading" className="mt-3 max-w-xl text-4xl font-bold leading-tight tracking-[-0.05em] sm:text-5xl">Complete your payment.</h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-black/60">Your offer is ready. Review the total here, then enter your card details directly in Stripe&apos;s secure form.</p>
        <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-black/10 bg-white shadow-[0_18px_60px_rgba(30,20,24,0.05)]">
          <div className="border-b border-black/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B12552]">{reference}</p>
            <h2 className="mt-2 text-xl font-bold">{payment.projectTitle}</h2>
            <p className="mt-1 text-sm text-black/55">Prepared for {payment.clientName}</p>
          </div>
          <div className="divide-y divide-black/8 px-6">
            {items.map((item, index) => <div key={index} className="flex items-start justify-between gap-4 py-4 text-sm">
              <div><p className="font-semibold">{item.name}</p><p className="mt-1 text-black/50">{item.quantity} × {formatMoney(item.unitAmount, payment.currency)}</p></div>
              <p className="shrink-0 font-semibold">{formatMoney(item.quantity * item.unitAmount, payment.currency)}</p>
            </div>)}
          </div>
          <div className="flex items-center justify-between gap-4 bg-[#FDF3F6] px-6 py-5">
            <span className="font-semibold">Total to pay</span>
            <strong className="text-2xl text-[#8B2040]">{formatMoney(payment.total, payment.currency)}</strong>
          </div>
        </div>
      </section>
      <section aria-labelledby="payment-heading" className="self-start rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_70px_rgba(30,20,24,0.05)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B12552]">Secure checkout</p>
        <h2 id="payment-heading" className="mt-3 text-2xl font-bold tracking-tight">Pay securely</h2>
        {publishableKey
          ? <div className="mt-6"><EmbeddedClientPayment token={token} publishableKey={publishableKey} /></div>
          : <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-800">Payment is temporarily unavailable. Please contact WeTrends.</p>}
        <a href={"mailto:team@wetrends.co.uk?subject=" + encodeURIComponent("Payment " + reference)} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#8B2040] underline underline-offset-4">Need help? Email the team</a>
      </section>
    </div>
    <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-black/50 sm:px-6">Private payment · {reference}</footer>
  </main>;
}
