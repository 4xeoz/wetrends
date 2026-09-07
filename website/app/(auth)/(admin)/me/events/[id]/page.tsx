import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Camera, CheckCircle2, Clock3, Mail, ReceiptText } from 'lucide-react';
import { prisma } from '@/prisma/prisma';
import { getEventGalleryUrl, getEventOfferUrl } from '@/lib/events/access';
import { formatMoney } from '@/lib/events/catalog';
import AdminEventControls from '@/app/_component/events/admin-event-controls';
import { isGoogleDriveConfigured } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

type OrderLine = { name?: string; quantity?: number };
function orderLines(value: unknown) {
  return Array.isArray(value) ? value as OrderLine[] : [];
}

function human(value: string) {
  return value.toLowerCase().replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());
}

export default async function EventJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();
  const job = await prisma.eventJob.findUnique({
    where: { id },
    include: {
      gallery: { include: { assets: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] } } },
      orders: { orderBy: { createdAt: 'desc' } },
      emails: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
  if (!job?.gallery) notFound();

  const offerUrl = getEventOfferUrl(job.id, job.accessVersion);
  const galleryUrl = getEventGalleryUrl(job.id, job.accessVersion);
  const totalCollected = job.orders.filter((order) => ['PAID', 'PROCESSING', 'FULFILLED'].includes(order.status)).reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-[#F7F4F2] px-4 py-8 text-[#101010] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/me/events" className="inline-flex items-center gap-2 text-xs font-bold text-black/50"><ArrowLeft className="h-4 w-4" /> Event Studio</Link>
        <header className="mt-7 grid gap-6 rounded-[2rem] bg-[#12090D] p-7 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F08BAB]">{job.eventType}</p><h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">{job.eventTitle}</h1><p className="mt-4 text-sm text-white/50">{job.clientName} · {job.clientEmail}{job.clientPhone ? ` · ${job.clientPhone}` : ''}</p></div>
          <div className="flex flex-wrap gap-2 lg:justify-end"><Pill>{human(job.status)}</Pill><Pill>{job.selectedPackage ? human(job.selectedPackage) : 'No collection yet'}</Pill><Pill>{formatMoney(totalCollected, job.currency)} collected</Pill></div>
        </header>

        <section className="my-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Fact icon={<Camera className="h-4 w-4" />} label="Photographer" value={job.photographerName} />
          <Fact icon={<Clock3 className="h-4 w-4" />} label="Event date" value={job.eventDate ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(job.eventDate) : 'Not recorded'} />
          <Fact icon={<CheckCircle2 className="h-4 w-4" />} label="Included" value={`${job.includedImageCount} photographs`} />
          <Fact icon={<ReceiptText className="h-4 w-4" />} label="Complete story" value={formatMoney(job.fullGalleryPrice, job.currency)} />
        </section>

        <AdminEventControls
          eventJobId={job.id}
          initialOfferUrl={offerUrl}
          galleryUrl={galleryUrl}
          clientEmail={job.clientEmail}
          testEmail={process.env.EVENT_TEST_EMAIL || null}
          selectedPackage={job.selectedPackage}
          galleryStatus={job.gallery.status}
          assetCount={job.gallery.assets.length}
          googleDriveConfigured={isGoogleDriveConfigured()}
          cloudinaryConfigured={Boolean(
            (process.env.EVENT_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
            && (process.env.EVENT_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY)
            && (process.env.EVENT_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET)
          )}
        />

        <section className="mt-7 grid gap-7 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Assets</p><h2 className="mt-2 text-2xl font-bold">Gallery photographs</h2></div><span className="text-xs font-bold text-black/35">{job.gallery.assets.length}</span></div><div className="mt-6 space-y-3">{job.gallery.assets.length === 0 ? <p className="rounded-2xl bg-[#F7F4F2] px-5 py-8 text-center text-sm text-black/40">No finished photographs yet.</p> : job.gallery.assets.map((asset, index) => <div key={asset.id} className="flex items-center gap-3 rounded-2xl border border-black/[0.06] p-3"><span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#FFF0F4] text-xs font-bold text-[#C72C5B]">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><p className="truncate text-sm font-bold">{asset.title}</p><p className="mt-1 truncate text-xs text-black/40">{asset.provider === 'google-drive' ? `${asset.driveMimeType || 'image'} · private company Drive` : asset.provider === 'cloudinary' ? `${asset.width} × ${asset.height} · private storage` : asset.sourceUrl}</p></div></div>)}</div></div>

          <div className="space-y-7">
            <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Payments</p><h2 className="mt-2 text-2xl font-bold">Orders</h2></div><ReceiptText className="h-5 w-5 text-black/25" /></div><div className="mt-6 space-y-4">{job.orders.length === 0 ? <p className="text-sm text-black/40">No orders yet.</p> : job.orders.map((order) => <article key={order.id} className="rounded-2xl bg-[#F7F4F2] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold">{human(order.type)} · {formatMoney(order.total, order.currency)}</p><p className="mt-1 text-xs text-black/40">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(order.createdAt)}</p></div><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">{human(order.status)}</span></div><ul className="mt-3 space-y-1 text-xs text-black/50">{orderLines(order.items).map((line, index) => <li key={index}>{line.name || 'Item'}{(line.quantity || 1) > 1 ? ` × ${line.quantity}` : ''}</li>)}</ul></article>)}</div></div>

            <div className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Delivery log</p><h2 className="mt-2 text-2xl font-bold">Emails</h2></div><Mail className="h-5 w-5 text-black/25" /></div><div className="mt-6 space-y-3">{job.emails.length === 0 ? <p className="text-sm text-black/40">No transactional emails yet.</p> : job.emails.map((email) => <div key={email.id} className="flex items-start justify-between gap-4 border-b border-black/[0.06] pb-3 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-bold">{human(email.kind)}</p><p className="mt-1 truncate text-xs text-black/40">{email.recipient}</p>{email.errorMessage && <p className="mt-1 text-xs text-red-600">{email.errorMessage}</p>}</div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${email.status === 'sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{email.status}</span></div>)}</div></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">{children}</span>; }
function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm"><span className="text-[#C72C5B]">{icon}</span><p className="mt-4 text-xs text-black/35">{label}</p><p className="mt-1 truncate text-sm font-bold">{value}</p></div>; }
