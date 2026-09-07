import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Clock3, Images } from 'lucide-react';
import { notFound } from 'next/navigation';
import { fulfillCheckoutSession } from '@/lib/events/fulfillment';
import { getEventJobFromToken } from '@/lib/events/queries';

export const metadata: Metadata = {
  title: 'Choices confirmed | WeTrends',
  robots: { index: false, follow: false },
};

export default async function EventConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ session_id?: string; order_id?: string }>;
}) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  let paymentConfirmed = false;
  if (query.session_id) {
    try {
      const result = await fulfillCheckoutSession(query.session_id);
      paymentConfirmed = result.fulfilled;
    } catch (error) {
      console.error('[event-confirmed]', error);
    }
  }

  const job = await getEventJobFromToken(token);
  if (!job) notFound();
  const referencedOrderConfirmed = Boolean(query.order_id && job.orders.some((order) => (
    order.id === query.order_id
    && order.type === 'DIGITAL'
    && ['CONFIRMED', 'PAID', 'FULFILLED'].includes(order.status)
  )));
  const confirmed = paymentConfirmed || Boolean(job.selectedPackage) || referencedOrderConfirmed;

  return (
    <main className="grid min-h-screen place-items-center bg-[#F7F3F2] px-4 py-12 text-[#0F0F0F]">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_100px_rgba(54,20,32,0.12)] sm:p-12">
        <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${confirmed ? 'bg-[#C72C5B] text-white' : 'bg-amber-100 text-amber-700'}`}>
          {confirmed ? <CheckCircle2 className="h-8 w-8" /> : <Clock3 className="h-8 w-8" />}
        </span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">{confirmed ? 'Confirmed' : 'Payment processing'}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">{confirmed ? 'We have your choices.' : 'Just a moment.'}</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-black/55">
          {confirmed
            ? `Our in-house team can now prepare your ${job.eventTitle} photographs. We’ll email ${job.clientEmail} when the gallery is ready.`
            : 'Stripe is still confirming the payment. Refresh this page in a moment; you will not be charged twice.'}
        </p>
        {job.gallery?.status === 'PUBLISHED' ? (
          <Link href={`/gallery/${token}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-7 py-4 text-sm font-bold text-white">
            <Images className="h-4 w-4" /> Open your gallery
          </Link>
        ) : (
          <Link href="/events" className="mt-8 inline-flex rounded-full border border-black/10 px-7 py-4 text-sm font-bold text-black/70">
            Return to WeTrends
          </Link>
        )}
      </div>
    </main>
  );
}
