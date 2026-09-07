import Link from 'next/link';
import { PackageCheck, Printer, Truck } from 'lucide-react';
import { prisma } from '@/prisma/prisma';
import { formatMoney } from '@/lib/events/catalog';
import AdminPrintOrderButton from '@/app/_component/events/admin-print-order-button';

export const dynamic = 'force-dynamic';

type Line = { name?: string; quantity?: number };
type Shipping = { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; postalCode?: string; country?: string } };

function human(value: string) { return value.toLowerCase().replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase()); }

export default async function PrintOrdersPage() {
  const orders = await prisma.eventOrder.findMany({
    where: { type: 'PRINT' },
    include: { eventJob: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  const ready = orders.filter((order) => order.status === 'PROCESSING').length;
  const dispatched = orders.filter((order) => order.status === 'FULFILLED').length;

  return (
    <div className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#101010] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">Fulfilment</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Print orders</h1><p className="mt-3 text-sm text-black/50">Paid baskets, delivery addresses, and dispatch status in one queue.</p></header>
        <section className="mt-8 grid grid-cols-2 gap-3 sm:max-w-xl"><div className="rounded-2xl bg-[#12090D] p-5 text-white"><Printer className="h-5 w-5 text-[#F08BAB]" /><p className="mt-5 text-3xl font-bold">{ready}</p><p className="mt-1 text-xs text-white/45">Ready to print</p></div><div className="rounded-2xl bg-white p-5 shadow-sm"><Truck className="h-5 w-5 text-[#C72C5B]" /><p className="mt-5 text-3xl font-bold">{dispatched}</p><p className="mt-1 text-xs text-black/40">Dispatched</p></div></section>

        <section className="mt-10 space-y-4 pb-12">
          {orders.length === 0 ? <div className="rounded-3xl border border-dashed border-black/15 bg-white px-6 py-16 text-center"><PackageCheck className="mx-auto h-8 w-8 text-[#C72C5B]" /><p className="mt-4 font-bold">No print orders yet</p><p className="mt-2 text-sm text-black/45">Paid print orders will appear here automatically.</p></div> : orders.map((order) => {
            const lines = Array.isArray(order.items) ? order.items as Line[] : [];
            const shipping = order.shippingAddress as Shipping | null;
            return <article key={order.id} className="grid gap-6 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm lg:grid-cols-[1fr_1fr_auto] lg:items-start">
              <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C72C5B]">{human(order.status)}</p><Link href={`/me/events/${order.eventJobId}`} className="mt-2 block text-xl font-bold hover:text-[#C72C5B]">{order.eventJob.eventTitle}</Link><p className="mt-2 text-sm text-black/45">{order.customerEmail}</p><p className="mt-3 text-2xl font-bold">{formatMoney(order.total, order.currency)}</p></div>
              <div><p className="text-xs font-bold text-black/40">Order</p><ul className="mt-3 space-y-1.5 text-sm">{lines.map((line, index) => <li key={index}>{line.name || 'Print'} × {line.quantity || 1}</li>)}</ul>{shipping?.address && <address className="mt-5 not-italic text-xs leading-relaxed text-black/50"><strong className="text-black/70">{shipping.name}</strong><br />{shipping.address.line1}<br />{shipping.address.line2 && <>{shipping.address.line2}<br /></>}{shipping.address.city} {shipping.address.postalCode}<br />{shipping.address.country}</address>}</div>
              <div className="lg:text-right"><p className="mb-4 text-xs text-black/35">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(order.createdAt)}</p>{order.status === 'PROCESSING' ? <AdminPrintOrderButton orderId={order.id} /> : order.status === 'FULFILLED' ? <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700"><PackageCheck className="h-4 w-4" /> Dispatched</span> : <span className="rounded-full bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600">{human(order.status)}</span>}</div>
            </article>;
          })}
        </section>
      </div>
    </div>
  );
}
