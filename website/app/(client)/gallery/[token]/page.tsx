import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClientGallery from '@/app/_component/events/client-gallery';
import { getEventJobFromToken, visibleGalleryAssets } from '@/lib/events/queries';

export const metadata: Metadata = {
  title: 'Your private gallery | WeTrends',
  robots: { index: false, follow: false },
};

export default async function GalleryPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const job = await getEventJobFromToken(token);
  if (!job?.gallery || job.gallery.status !== 'PUBLISHED' || !job.selectedPackage) notFound();

  const assets = visibleGalleryAssets(job.gallery.assets, job.selectedPackage, job.includedImageCount);
  return (
    <ClientGallery
      token={token}
      clientName={job.clientName}
      eventTitle={job.eventTitle}
      packageLabel={job.selectedPackage === 'FULL' ? 'Complete Story' : `${job.includedImageCount} photograph collection`}
      assets={assets.map((asset) => ({
        id: asset.id,
        title: asset.title,
        alt: asset.alt,
        previewUrl: `/api/gallery/${token}/assets/${asset.id}`,
        downloadUrl: `/api/gallery/${token}/assets/${asset.id}?mode=download`,
      }))}
    />
  );
}
