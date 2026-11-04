import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import { getClientPaymentUrl } from "@/lib/client-payments/access";
import { paymentIdPattern, paymentItemsFromJson, paymentReference } from "@/lib/client-payments/policy";
import { formatMoney } from "@/lib/events/catalog";
import ClientPaymentForm from "@/app/_component/client-payments/payment-form";
import ClientPaymentControls from "@/app/_component/client-payments/payment-controls";

export const dynamic = "force-dynamic";

export default async function ClientPaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!paymentIdPattern.test(id)) notFound();
  const payment = await prisma.clientPaymentRequest.findUnique({ where: { id } });
  if (!payment) notFound();
  const items = paymentItemsFromJson(payment.items);
  if (!items) throw new Error("Payment request items are invalid");
  let url: string | null = null;
  if (payment.status !== "DRAFT") {
    try { url = getClientPaymentUrl(payment.id, payment.accessVersion); } catch { /* Show the record even if link signing is unavailable. */ }
  }
  return <main className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#151515] sm:px-6 lg:px-10">
    <div className="mx-auto max-w-5xl">
      <Link href="/me/payments" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-black/55 hover:text-black"><ArrowLeft className="h-4 w-4" /> Payment requests</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">{paymentReference(payment.id)}</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.05em]">{payment.projectTitle}</h1><p className="mt-3 break-words text-sm text-black/55">{payment.clientName} · {payment.clientEmail}</p></div>
        <span className={`rounded-full px-4 py-2 text-sm font-bold ${payment.status === "PAID" ? "bg-emerald-50 text-emerald-800" : payment.status === "VOID" ? "bg-slate-200 text-slate-700" : "bg-[#FFF0F4] text-[#8B2040]"}`}>{payment.status === "OPEN" ? "Awaiting payment" : payment.status === "VOID" ? "Voided" : payment.status === "PAID" ? "Paid" : "Draft"}</span>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-8">
          {payment.status === "DRAFT" ? <ClientPaymentForm paymentId={payment.id} initial={{
            clientName: payment.clientName, clientEmail: payment.clientEmail, projectTitle: payment.projectTitle,
            note: payment.note || "", items: items.map((item) => ({ name: item.name, description: item.description, quantity: String(item.quantity), unitPrice: (item.unitAmount / 100).toFixed(2) })),
          }} /> : <div>
            <h2 className="text-xl font-bold">Agreed items</h2>
            {payment.note && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-black/60">{payment.note}</p>}
            <div className="mt-5 divide-y divide-black/10 border-t border-black/10">
              {items.map((item, index) => <div key={index} className="flex flex-wrap items-start justify-between gap-3 py-4"><div><p className="font-semibold">{item.name}</p>{item.description && <p className="mt-1 text-sm text-black/55">{item.description}</p>}<p className="mt-1 text-xs text-black/45">{item.quantity} × {formatMoney(item.unitAmount, payment.currency)}</p></div><p className="font-bold">{formatMoney(item.quantity * item.unitAmount, payment.currency)}</p></div>)}
            </div>
            <div className="flex items-center justify-between border-t border-black/15 pt-5"><span className="font-semibold">Total paid or due</span><span className="text-2xl font-bold">{formatMoney(payment.total, payment.currency)}</span></div>
            {payment.status === "PAID" && <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Confirmed {payment.paidAt ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(payment.paidAt) : ""}</p>}
          </div>}
        </section>
        <aside><ClientPaymentControls paymentId={payment.id} status={payment.status} url={url} /><p className="mt-5 px-2 text-xs leading-relaxed text-black/45">This is a payment request. Issue any formal invoice through your normal accounting process.</p></aside>
      </div>
    </div>
  </main>;
}
