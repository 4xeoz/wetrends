import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClientEventOffer from '@/app/_component/events/client-event-offer';
import { verifyReferralClaim } from '@/lib/events/access';
import { getEventJobFromToken } from '@/lib/events/queries';

export const metadata: Metadata = {
  title: 'Your event photographs | WeTrends',
  robots: { index: false, follow: false },
};

export default async function ClientEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ cancelled?: string; ref?: string }>;
}) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  const job = await getEventJobFromToken(token);
  if (!job) notFound();
  const referralClaim = query.ref && verifyReferralClaim(query.ref)?.token === token ? query.ref : null;

  return (
    <ClientEventOffer
      token={token}
      cancelled={query.cancelled === '1'}
      referralClaim={referralClaim}
      job={{
        clientName: job.clientName,
        eventTitle: job.eventTitle,
        eventType: job.eventType,
        eventDate: job.eventDate?.toISOString() || null,
        location: job.location,
        photographerName: job.photographerName,
        photographerImage: job.photographerImage,
        partnerName: job.partnerName,
        includedImageCount: job.includedImageCount,
        fullGalleryPrice: job.fullGalleryPrice,
        retouchingPrice: job.retouchingPrice,
        extraCoverageMinutes: job.extraCoverageMinutes,
        extraCoveragePrice: job.extraCoveragePrice,
        currency: job.currency,
        selectedPackage: job.selectedPackage,
        status: job.status,
        galleryPublished: job.gallery?.status === 'PUBLISHED',
      }}
    />
  );
}
