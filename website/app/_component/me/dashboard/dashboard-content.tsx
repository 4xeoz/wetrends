'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Images,
  MessageSquare,
  PoundSterling,
  Printer,
  RefreshCw,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/events/catalog';
import type { DashboardJob, DashboardOverview } from '@/actions/dashboard';

interface DashboardContentProps {
  overview: DashboardOverview;
  isLoading: boolean;
  onRefresh: () => void | Promise<void>;
  error?: string | null;
}

type NextAction = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

type AttentionItem = {
  id: string;
  title: string;
  description: string;
  meta: string;
  href: string;
  action: string;
  icon: typeof UserRound;
};

const jobStatusesForAttention = new Set(['DRAFT', 'OFFER_SENT', 'AWAITING_PAYMENT', 'IN_PRODUCTION', 'GALLERY_READY']);

export function DashboardContent({ overview, isLoading, onRefresh, error }: DashboardContentProps) {
  const nextAction = getNextAction(overview);
  const attentionItems = getAttentionItems(overview);

  return (
    <div className="min-h-[100svh] bg-[#F7F4F2] px-4 py-7 text-[#101010] sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5 border-b border-black/[0.06] pb-7 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">WeTrends · Operations</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Event Studio overview.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/50">Leads, galleries, payments, and fulfilment in one clear view.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => { void onRefresh(); }}
              variant="outline"
              disabled={isLoading}
              className="gap-2 rounded-full border-black/10 bg-white px-4 text-xs font-bold hover:border-black/25 hover:bg-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing…' : 'Refresh'}
            </Button>
            <Link href="/me/events/new" className="inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-5 py-3 text-xs font-bold text-white transition hover:bg-black">
              New event offer <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.header>

        {error && (
          <div role="status" className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-xs font-semibold text-amber-900">
            We’re showing the last available view. Refresh to try again.
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="relative mt-7 overflow-hidden rounded-[2.25rem] bg-[#12090D] p-6 text-white shadow-[0_26px_90px_rgba(58,24,36,0.18)] sm:p-8 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-10"
        >
          <Image src="/images/events-mesh-light.png?v=dashboard" alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="pointer-events-none absolute inset-0 z-0 object-cover opacity-75" />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(110deg,rgba(18,9,13,0.96),rgba(92,15,43,0.76)_54%,rgba(18,9,13,0.72))]" />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F08BAB]">{nextAction.eyebrow}</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-0.05em] sm:text-4xl">{nextAction.title}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65">{nextAction.description}</p>
            <Link href={nextAction.href} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#12090D] transition hover:bg-[#F08BAB]">
              {nextAction.cta} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="relative z-10 mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:mt-0">
            <PipelineStat label="New leads" value={overview.metrics.newLeads} />
            <PipelineStat label="Active events" value={overview.metrics.activeJobs} />
            <PipelineStat label="Galleries ready" value={overview.metrics.galleriesReady} />
          </div>
        </motion.section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={UserRound} label="New enquiries" value={overview.metrics.newLeads} detail="Need a reply" accent />
          <MetricCard icon={CalendarDays} label="Active events" value={overview.metrics.activeJobs} detail="In the pipeline" />
          <MetricCard icon={Images} label="Galleries ready" value={overview.metrics.galleriesReady} detail="Ready to deliver" />
          <MetricCard icon={PoundSterling} label="Collected" value={formatMoney(overview.metrics.collected)} detail="Paid, processing, fulfilled" />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Action queue</p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">What needs your attention</h2>
              </div>
              <Link href="/me/events" className="text-xs font-bold text-[#C72C5B]">Event Studio <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>
            </div>

            {attentionItems.length > 0 ? (
              <div className="mt-6 divide-y divide-black/[0.06]">
                {attentionItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    className="group flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                  >
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-[#FFF0F4] text-[#C72C5B]"><item.icon className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.title}</p>
                      <p className="mt-1 truncate text-xs text-black/45">{item.description}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">{item.meta}</p>
                    </div>
                    <Link href={item.href} className="inline-flex flex-none items-center gap-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#C72C5B] opacity-75 transition group-hover:opacity-100">
                      {item.action} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-[#C72C5B]/25 bg-[#FFF8FA] px-5 py-10 text-center">
                <Sparkles className="mx-auto h-6 w-6 text-[#C72C5B]" />
                <p className="mt-3 text-sm font-bold">Your queue is clear.</p>
                <p className="mt-1 text-xs text-black/45">Create a new offer when the next event is ready.</p>
                <Link href="/me/events/new" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-4 py-2.5 text-xs font-bold text-white">New event offer <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="rounded-[2rem] border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Pipeline</p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Latest event work</h2>
              </div>
              <Link href="/me/events" className="text-xs font-bold text-[#C72C5B]">View all <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>
            </div>
            {overview.jobs.length > 0 ? (
              <div className="mt-6 divide-y divide-black/[0.06]">
                {overview.jobs.slice(0, 5).map((job, index) => <JobRow key={job.id} job={job} index={index} />)}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-black/10 px-5 py-10 text-center">
                <CalendarDays className="mx-auto h-6 w-6 text-[#C72C5B]" />
                <p className="mt-3 text-sm font-bold">No events yet.</p>
                <Link href="/me/events/new" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#C72C5B]">Create the first offer <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            )}
          </motion.section>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/[0.06] pt-5 text-xs font-semibold text-black/35">
          <Link href="/me/events" className="transition hover:text-[#C72C5B]">Event Studio</Link>
          <Link href="/me/print-orders" className="transition hover:text-[#C72C5B]">Print queue{overview.metrics.printQueue > 0 ? ` · ${overview.metrics.printQueue}` : ''}</Link>
          <Link href="/me/messages" className="transition hover:text-[#C72C5B]">Messages{overview.metrics.unreadMessages > 0 ? ` · ${overview.metrics.unreadMessages} new` : ''}</Link>
        </div>
      </div>
    </div>
  );
}

function getNextAction(overview: DashboardOverview): NextAction {
  const lead = overview.leads.find((item) => item.status === 'NEW');
  if (overview.metrics.newLeads > 0) {
    return {
      eyebrow: 'Next best action',
      title: overview.metrics.newLeads === 1 ? 'Reply to your newest enquiry.' : `Reply to ${overview.metrics.newLeads} new enquiries.`,
      description: lead ? `${lead.eventType} · ${lead.location}. Turn the enquiry into a clear private offer.` : 'Turn the newest enquiry into a clear private offer.',
      href: '/me/events',
      cta: 'Open leads',
    };
  }

  const draft = overview.jobs.find((job) => job.status === 'DRAFT');
  if (draft) return { eyebrow: 'Next best action', title: `Finish ${compactTitle(draft.eventTitle)}.`, description: 'Complete the private offer while the event details are fresh.', href: `/me/events/${draft.id}`, cta: 'Open event' };

  const awaitingPayment = overview.jobs.find((job) => job.status === 'AWAITING_PAYMENT');
  if (awaitingPayment) return { eyebrow: 'Payment pending', title: `Check ${compactTitle(awaitingPayment.eventTitle)}.`, description: 'A client is at the payment stage. Review the event and follow up if needed.', href: `/me/events/${awaitingPayment.id}`, cta: 'View event' };

  const inProduction = overview.jobs.find((job) => job.status === 'IN_PRODUCTION');
  if (inProduction) return { eyebrow: 'Gallery production', title: `Finish ${compactTitle(inProduction.eventTitle)}.`, description: 'Upload the finished photographs and publish the gallery when it is ready.', href: `/me/events/${inProduction.id}`, cta: 'Open event' };

  const readyGallery = overview.jobs.find((job) => job.status === 'GALLERY_READY');
  if (readyGallery) return { eyebrow: 'Ready to deliver', title: `Send ${compactTitle(readyGallery.eventTitle)}.`, description: 'The gallery is ready. Open the event to publish or resend the client email.', href: `/me/events/${readyGallery.id}`, cta: 'Open event' };

  if (overview.metrics.printQueue > 0) return { eyebrow: 'Fulfilment', title: `Fulfil ${overview.metrics.printQueue} print order${overview.metrics.printQueue === 1 ? '' : 's'}.`, description: 'Paid print work is waiting in the fulfilment queue.', href: '/me/print-orders', cta: 'Open print queue' };

  if (overview.metrics.unreadMessages > 0) return { eyebrow: 'Inbox', title: `Read ${overview.metrics.unreadMessages} new message${overview.metrics.unreadMessages === 1 ? '' : 's'}.`, description: 'Reply while the enquiry is still warm.', href: '/me/messages', cta: 'Open messages' };

  return { eyebrow: 'Ready when you are', title: 'Create the next event offer.', description: 'Start with the details you already have from the client.', href: '/me/events/new', cta: 'New event offer' };
}

function getAttentionItems(overview: DashboardOverview): AttentionItem[] {
  const leads: AttentionItem[] = overview.leads.filter((lead) => lead.status === 'NEW').slice(0, 2).map((lead) => ({
    id: `lead-${lead.id}`,
    title: lead.name,
    description: `${lead.eventType} · ${lead.location}`,
    meta: `Enquiry ${formatDate(lead.createdAt)}`,
    href: `/me/events/new?lead=${encodeURIComponent(lead.id)}`,
    action: 'Create offer',
    icon: UserRound,
  }));

  const jobs: AttentionItem[] = overview.jobs.filter((job) => jobStatusesForAttention.has(job.status)).slice(0, 3).map((job) => ({
    id: `job-${job.id}`,
    title: compactTitle(job.eventTitle),
    description: `${job.clientName} · ${statusLabel(job.status)}`,
    meta: job.galleryAssetCount > 0 ? `${job.galleryAssetCount} photographs` : 'No photographs uploaded',
    href: `/me/events/${job.id}`,
    action: 'Open event',
    icon: job.status === 'GALLERY_READY' ? CheckCircle2 : CalendarDays,
  }));

  const printOrders: AttentionItem[] = overview.orders.filter((order) => order.type === 'PRINT' && order.status === 'PROCESSING').slice(0, 2).map((order) => ({
    id: `print-${order.id}`,
    title: `Print order · ${compactTitle(order.eventTitle, 26)}`,
    description: 'Paid order ready to fulfil',
    meta: formatMoney(order.total, order.currency),
    href: '/me/print-orders',
    action: 'Open queue',
    icon: Printer,
  }));

  const messages: AttentionItem[] = overview.messages.filter((message) => !message.isRead).slice(0, 2).map((message) => ({
    id: `message-${message.id}`,
    title: `Message from ${message.name}`,
    description: message.message,
    meta: `Received ${formatDate(message.createdAt)}`,
    href: '/me/messages',
    action: 'Read message',
    icon: MessageSquare,
  }));

  return [...leads, ...jobs, ...printOrders, ...messages].slice(0, 5);
}

function JobRow({ job, index }: { job: DashboardJob; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}>
      <Link href={`/me/events/${job.id}`} className="group flex items-center gap-3 py-4 first:pt-0 last:pb-0">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-[#F7F4F2] text-[#C72C5B]"><CalendarDays className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{job.eventTitle}</p>
          <p className="mt-1 truncate text-xs text-black/45">{job.clientName} · {job.eventType}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30">{job.galleryAssetCount} photographs{job.eventDate ? ` · ${formatDate(job.eventDate)}` : ''}</p>
        </div>
        <div className="flex flex-none flex-col items-end gap-2">
          <StatusPill status={job.status} />
          <ArrowRight className="h-3.5 w-3.5 text-black/25 transition group-hover:translate-x-0.5 group-hover:text-[#C72C5B]" />
        </div>
      </Link>
    </motion.div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, accent = false }: { icon: typeof UserRound; label: string; value: string | number; detail: string; accent?: boolean }) {
  return (
    <div className={`rounded-[1.5rem] border p-5 shadow-sm ${accent ? 'border-[#C72C5B] bg-[#C72C5B] text-white' : 'border-black/[0.06] bg-white'}`}>
      <div className="flex items-center justify-between gap-4">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${accent ? 'bg-white/15 text-white' : 'bg-[#FFF0F4] text-[#C72C5B]'}`}><Icon className="h-4 w-4" /></span>
        <span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${accent ? 'text-white/55' : 'text-black/30'}`}>{detail}</span>
      </div>
      <p className="mt-5 text-3xl font-bold tracking-[-0.05em]">{value}</p>
      <p className={`mt-1 text-xs font-semibold ${accent ? 'text-white/70' : 'text-black/45'}`}>{label}</p>
    </div>
  );
}

function PipelineStat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl"><p className="text-2xl font-bold tracking-[-0.04em]">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">{label}</p></div>;
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    OFFER_SENT: 'bg-blue-50 text-blue-700',
    AWAITING_PAYMENT: 'bg-amber-50 text-amber-700',
    IN_PRODUCTION: 'bg-violet-50 text-violet-700',
    GALLERY_READY: 'bg-emerald-50 text-emerald-700',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-50 text-red-700',
  };
  return <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${styles[status] || 'bg-slate-100 text-slate-600'}`}>{statusLabel(status)}</span>;
}

function statusLabel(value: string) {
  return value.toLowerCase().replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(value));
}

function compactTitle(value: string, length = 34) {
  return value.length > length ? `${value.slice(0, length - 1).trimEnd()}…` : value;
}
