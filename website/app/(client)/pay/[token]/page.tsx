import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getClientPaymentFromToken } from "@/lib/client-payments/access";
import { paymentItemsFromJson, paymentReference } from "@/lib/client-payments/policy";
import { formatMoney } from "@/lib/events/catalog";
import EmbeddedClientPayment from "@/app/_component/client-payments/embedded-payment";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private payment | WeTrends",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default async function ClientPaymentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payment = await getClientPaymentFromToken(token);
  if (!payment) notFound();
  const items = paymentItemsFromJson(payment.items);
  if (!items) throw new Error("Payment request items are invalid");
  const reference = paymentReference(payment.id);
  const paid = payment.status === "PAID";
  const voided = payment.status === "VOID";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  return <main className="min-h-screen bg-[#F7F4F2] text-[#151515]">
    <header className="relative overflow-hidden bg-[#171619] px-5 pb-12 pt-6 text-white sm:px-8 sm:pb-16 lg:px-12">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-36 h-96 w-96 rounded-full bg-[#C72C5B]/35 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-72 rounded-full bg-[#7B4569]/25 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/" aria-label="WeTrends home" className="inline-flex rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Image src="/images/logo-transparent.svg" alt="WeTrends" width={52} height={35} priority className="h-8 w-auto" />
          </Link>
          <span className="inline-flex items-center rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/75">Private payment</span>
        </div>
        <div className="mt-10 grid items-end gap-7 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F28AAA]">Prepared for {payment.clientName}</p><h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:text-6xl">{paid ? "Thank you. Payment received." : voided ? "This request is closed." : "Your project. Clearly outlined."}</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">{payment.projectTitle}</p></div>
          <div className="rounded-3xl border border-white/15 bg-white/[0.08] px-6 py-5 backdrop-blur-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">{paid ? "Amount paid" : "Total to pay"}</p><p className="mt-2 text-4xl font-bold tracking-tight">{formatMoney(payment.total, payment.currency)}</p><p className="mt-2 text-xs text-white/50">Reference {reference}</p></div>
        </div>
      </div>
    </header>
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.82fr)] lg:gap-8 lg:px-8">
      <section aria-labelledby="summary-heading" className="self-start overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_70px_rgba(30,20,24,0.05)]">
        <div className="border-b border-black/8 p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">The agreement</p><h2 id="summary-heading" className="mt-3 text-2xl font-bold tracking-tight">What you&apos;re paying for</h2>{payment.note && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/60">{payment.note}</p>}</div>
        <div className="divide-y divide-black/8 px-6 sm:px-8">
          {items.map((item, index) => <div key={index} className="flex flex-wrap items-start justify-between gap-4 py-5"><div className="min-w-0 flex-1"><p className="font-semibold leading-snug">{item.name}</p>{item.description && <p className="mt-1 text-sm leading-relaxed text-black/55">{item.description}</p>}<p className="mt-2 text-xs font-medium text-black/40">{item.quantity} × {formatMoney(item.unitAmount, payment.currency)}</p></div><p className="font-bold">{formatMoney(item.quantity * item.unitAmount, payment.currency)}</p></div>)}
        </div>
        <div className="flex items-center justify-between gap-4 bg-[#FDF3F6] px-6 py-6 sm:px-8"><span className="font-semibold">{paid ? "Paid in full" : "Total to pay"}</span><span className="text-2xl font-bold tracking-tight text-[#8B2040]">{formatMoney(payment.total, payment.currency)}</span></div>
        <p className="px-6 py-5 text-xs leading-relaxed text-black/45 sm:px-8">Please check these agreed details before paying. If anything looks wrong, contact us before entering card details.</p>
      </section>
      <section aria-labelledby="payment-heading" className="self-start rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_70px_rgba(30,20,24,0.05)] sm:p-8 lg:sticky lg:top-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Secure checkout</p>
        <h2 id="payment-heading" className="mt-3 text-2xl font-bold tracking-tight">{paid ? "All settled." : voided ? "Payment unavailable" : "Complete your payment"}</h2>
        {paid ? <div className="mt-6"><p className="text-sm leading-relaxed text-black/60">Your payment has been confirmed. Thank you for working with our team.</p><Link href={`/pay/${token}/result`} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white transition hover:bg-[#A3244A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">View confirmation</Link></div>
          : voided ? <p className="mt-5 text-sm leading-relaxed text-black/60">This request no longer accepts payment. Please contact us for an updated link.</p>
          : publishableKey ? <div className="mt-6"><EmbeddedClientPayment token={token} publishableKey={publishableKey} /></div>
          : <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-800">Payment is temporarily unavailable. Please contact WeTrends.</p>}
        <a href={`mailto:team@wetrends.co.uk?subject=${encodeURIComponent(`Payment ${reference}`)}`} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#8B2040] underline underline-offset-4">Need help? Email the team</a>
      </section>
    </div>
    <footer className="mx-auto max-w-6xl px-4 pb-10 text-xs text-black/45 sm:px-6 lg:px-8">Secure payment for agreed work · {reference}</footer>
  </main>;
}
