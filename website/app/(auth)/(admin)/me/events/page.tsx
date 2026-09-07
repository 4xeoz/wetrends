import Link from 'next/link';
import { ArrowRight, CalendarDays, PoundSterling, Images, Inbox, Plus, UserRound } from 'lucide-react';
import { prisma } from '@/prisma/prisma';
import { formatMoney } from '@/lib/events/catalog';
import AdminLeadStatus from '@/app/_component/events/admin-lead-status';

export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  OFFER_SENT: 'bg-blue-50 text-blue-700',
  AWAITING_PAYMENT: 'bg-amber-50 text-amber-700',
  IN_PRODUCTION: 'bg-violet-50 text-violet-700',
  GALLERY_READY: 'bg-emerald-50 text-emerald-700',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-50 text-red-700',
};

function label(value: string) {
  return value.toLowerCase().replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());
}

export default async function EventStudioPage() {
  const [leads, jobs, paidOrders] = await Promise.all([
    prisma.eventLead.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.eventJob.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        gallery: { include: { _count: { select: { assets: true } } } },
        orders: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
      take: 50,
    }),
    prisma.eventOrder.aggregate({
      where: { status: { in: ['PAID', 'PROCESSING', 'FULFILLED'] } },
      _sum: { total: true },
    }),
  ]);

  const activeJobs = jobs.filter((job) => !['COMPLETED', 'CANCELLED'].includes(job.status)).length;
  const galleriesReady = jobs.filter((job) => job.gallery?.status === 'PUBLISHED').length;
  const newLeads = leads.filter((lead) => lead.status === 'NEW').length;

  return (
    <div className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#101010] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">Operations</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Event Studio</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/50">Move each event from enquiry to paid collection, gallery delivery, and print fulfilment.</p>
          </div>
          <Link href="/me/events/new" className="inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black"><Plus className="h-4 w-4" /> New event offer</Link>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric icon={<Inbox />} label="New leads" value={String(newLeads)} />
          <Metric icon={<CalendarDays />} label="Active events" value={String(activeJobs)} />
          <Metric icon={<Images />} label="Live galleries" value={String(galleriesReady)} />
          <Metric icon={<PoundSterling />} label="Collected" value={formatMoney(paidOrders._sum.total || 0)} />
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Pipeline</p><h2 className="mt-2 text-2xl font-bold">Event jobs</h2></div><span className="text-xs font-semibold text-black/40">{jobs.length} total</span></div>
          {jobs.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-black/15 bg-white px-6 py-14 text-center"><CalendarDays className="mx-auto h-8 w-8 text-[#C72C5B]" /><p className="mt-4 font-bold">No event jobs yet</p><p className="mt-2 text-sm text-black/45">Create the first private offer from a lead or from scratch.</p></div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {jobs.map((job) => {
                const latestOrder = job.orders[0];
                return (
                  <Link key={job.id} href={`/me/events/${job.id}`} className="group rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C72C5B]">{job.eventType}</p><h3 className="mt-2 text-2xl font-bold tracking-[-0.035em]">{job.eventTitle}</h3><p className="mt-2 text-sm text-black/45">{job.clientName} · {job.clientEmail}</p></div><span className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${statusStyles[job.status] || 'bg-slate-100 text-slate-700'}`}>{label(job.status)}</span></div>
                    <div className="mt-6 grid grid-cols-3 gap-3 border-t border-black/[0.06] pt-5 text-xs"><div><p className="text-black/35">Collection</p><p className="mt-1 font-bold">{job.selectedPackage ? label(job.selectedPackage) : 'Awaiting'}</p></div><div><p className="text-black/35">Gallery</p><p className="mt-1 font-bold">{job.gallery?._count.assets || 0} photos</p></div><div><p className="text-black/35">Latest order</p><p className="mt-1 font-bold">{latestOrder ? formatMoney(latestOrder.total, latestOrder.currency) : '—'}</p></div></div>
                    <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#C72C5B]">Open event <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-12 pb-12">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Enquiries</p><h2 className="mt-2 text-2xl font-bold">Event leads</h2></div><span className="text-xs font-semibold text-black/40">Newest first</span></div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-sm">
            {leads.length === 0 ? <p className="px-6 py-12 text-center text-sm text-black/45">New event enquiries will appear here.</p> : leads.map((lead) => (
              <article key={lead.id} className="grid gap-5 border-b border-black/[0.06] p-5 last:border-0 lg:grid-cols-[1.1fr_1fr_auto] lg:items-center">
                <div className="flex items-start gap-3"><span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#FFF0F4] text-[#C72C5B]"><UserRound className="h-4 w-4" /></span><div><p className="font-bold">{lead.name}</p><a href={`mailto:${lead.email}`} className="mt-1 block text-xs text-black/45">{lead.email}</a><a href={`tel:${lead.phone}`} className="mt-1 block text-xs text-black/45">{lead.phone}</a></div></div>
                <div className="text-sm"><p className="font-semibold">{lead.eventType} · {new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(lead.eventDate)}</p><p className="mt-1 text-xs text-black/45">{lead.location} · {lead.duration} · {lead.media}</p></div>
                <div className="flex flex-wrap items-center gap-2"><AdminLeadStatus leadId={lead.id} status={lead.status} /><Link href={`/me/events/new?lead=${lead.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white">Create offer <ArrowRight className="h-3.5 w-3.5" /></Link></div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactElement<{ className?: string }>; label: string; value: string }) {
  return <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5"><span className="text-[#C72C5B]">{icon}</span><p className="mt-5 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{value}</p><p className="mt-1 text-xs font-semibold text-black/40">{label}</p></div>;
}
