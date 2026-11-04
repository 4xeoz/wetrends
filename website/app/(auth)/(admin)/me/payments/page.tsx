import Link from "next/link";
import { ArrowRight, CreditCard, Plus } from "lucide-react";
import { prisma } from "@/prisma/prisma";
import { formatMoney } from "@/lib/events/catalog";
import { paymentReference } from "@/lib/client-payments/policy";

export const dynamic = "force-dynamic";

export default async function ClientPaymentsPage({ searchParams }: {
  searchParams: Promise<{ page?: string }>;
}) {
  const requestedPage = (await searchParams).page || "1";
  const page = /^\d{1,4}$/.test(requestedPage) ? Math.max(1, Number(requestedPage)) : 1;
  const pageSize = 24;
  const rows = await prisma.clientPaymentRequest.findMany({
    orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize + 1,
  });
  const hasNextPage = rows.length > pageSize;
  const payments = rows.slice(0, pageSize);
  return <main className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#151515] sm:px-6 lg:px-10">
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">Client payments</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Payment requests</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/55">Build a private, itemised payment page for services already agreed with a client.</p>
        </div>
        <Link href="/me/payments/new" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white hover:bg-[#A8254D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">
          <Plus className="h-4 w-4" /> New request
        </Link>
      </header>
      {!payments.length ? <section className="mt-8 rounded-3xl border border-dashed border-black/15 bg-white p-10 text-center sm:p-14">
        <CreditCard className="mx-auto h-10 w-10 text-[#C72C5B]" />
        <h2 className="mt-4 text-xl font-bold">{page === 1 ? "No payment requests yet" : "No requests on this page"}</h2>
        <p className="mt-2 text-sm text-black/50">{page === 1 ? "Create one when the scope and price are agreed." : "Go to the previous page to see earlier requests."}</p>
      </section> : <section className="mt-8 grid gap-4 md:grid-cols-2">
        {payments.map((payment) => <Link key={payment.id} href={`/me/payments/${payment.id}`} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:border-[#C72C5B]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C72C5B]">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C72C5B]">{paymentReference(payment.id)}</p><h2 className="mt-2 text-xl font-bold tracking-tight">{payment.projectTitle}</h2></div>
            <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${payment.status === "PAID" ? "bg-emerald-50 text-emerald-800" : payment.status === "VOID" ? "bg-slate-100 text-slate-700" : "bg-[#FFF0F4] text-[#8B2040]"}`}>
              {payment.status === "OPEN" ? "Awaiting payment" : payment.status === "VOID" ? "Voided" : payment.status === "PAID" ? "Paid" : "Draft"}
            </span>
          </div>
          <p className="mt-3 break-words text-sm text-black/55">{payment.clientName} · {payment.clientEmail}</p>
          <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4"><span className="text-lg font-bold">{formatMoney(payment.total, payment.currency)}</span><span className="inline-flex items-center gap-1 text-xs font-bold text-[#C72C5B]">Open <ArrowRight className="h-4 w-4" /></span></div>
        </Link>)}
      </section>}
      {(page > 1 || hasNextPage) && <nav aria-label="Payment request pages" className="mt-8 flex items-center justify-center gap-4 text-sm font-semibold">
        {page > 1 && <Link href={`/me/payments?page=${page - 1}`} className="rounded-full border border-black/15 bg-white px-5 py-3 hover:border-[#C72C5B]">Previous</Link>}
        <span className="text-black/55">Page {page}</span>
        {hasNextPage && <Link href={`/me/payments?page=${page + 1}`} className="rounded-full border border-black/15 bg-white px-5 py-3 hover:border-[#C72C5B]">Next</Link>}
      </nav>}
    </div>
  </main>;
}
