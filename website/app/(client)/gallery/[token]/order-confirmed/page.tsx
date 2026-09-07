import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Clock3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { GalleryHeader, GallerySteps } from '@/app/_component/events/gallery-chrome';
import { fulfillCheckoutSession } from '@/lib/events/fulfillment';
import { getEventJobFromToken } from '@/lib/events/queries';

export const metadata: Metadata = {
  title: 'Print order received | WeTrends',
  robots: { index: false, follow: false },
};

export default async function PrintOrderConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  const job = await getEventJobFromToken(token);
  if (!job) notFound();

  let confirmed = false;
  let recipientEmail = job.clientEmail;
  if (query.session_id) {
    try {
      const result = await fulfillCheckoutSession(query.session_id);
      if (result.fulfilled && result.order.eventJobId === job.id && result.order.type === 'PRINT') {
        confirmed = true;
        recipientEmail = result.order.customerEmail;
      }
    } catch (error) {
      console.error('[print-confirmed]', error);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F4F2] text-[#0F0F0F]">
      <GalleryHeader token={token} eventTitle={job.eventTitle} backHref={`/gallery/${token}`} backLabel="Gallery" />
      <GallerySteps active={4} completeCurrent={confirmed} />
      <section className="relative isolate grid min-h-[calc(100svh-166px)] place-items-center overflow-hidden border-t border-black/[0.06] px-4 py-12">
        <Image src="/images/events-mesh-light.png?v=brand-magenta" alt="" fill priority sizes="100vw" className="pointer-events-none absolute inset-0 object-cover" />
        <div className="absolute inset-0 bg-white/35" />
        <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white/90 p-8 text-center shadow-[0_30px_90px_rgba(86,24,45,0.15)] backdrop-blur-xl sm:p-12">
          <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${confirmed ? 'bg-[#C72C5B] text-white' : 'bg-amber-100 text-amber-700'}`}>
            {confirmed ? <CheckCircle2 className="h-8 w-8" /> : <Clock3 className="h-8 w-8" />}
          </span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">04 · {confirmed ? 'Done' : 'Confirming payment'}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">{confirmed ? 'Your order is in.' : 'Just a moment.'}</h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-black/55">
            {confirmed ? `We’ll prepare your frames carefully and email ${recipientEmail} when they are dispatched.` : 'Stripe is still confirming the payment. Check again in a moment.'}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {!confirmed && query.session_id ? (
              <Link href={`/gallery/${token}/order-confirmed?session_id=${encodeURIComponent(query.session_id)}`} className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#C72C5B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#A91F49]">Check payment</Link>
            ) : null}
            <Link href={`/gallery/${token}`} className={`inline-flex min-h-[52px] items-center justify-center rounded-full px-7 py-4 text-sm font-bold transition ${confirmed ? 'bg-[#C72C5B] text-white hover:bg-[#A91F49]' : 'border border-black/10 bg-white text-black hover:border-black/25'}`}>Return to your gallery</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
