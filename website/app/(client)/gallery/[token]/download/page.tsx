import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GalleryDownload from '@/app/_component/events/gallery-download';
import { getEventJobFromToken, visibleGalleryAssets } from '@/lib/events/queries';

export const metadata: Metadata = {
  title: 'Download event photographs | WeTrends',
  robots: { index: false, follow: false },
};

export default async function DownloadGalleryPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const job = await getEventJobFromToken(token);
  if (!job?.gallery || job.gallery.status !== 'PUBLISHED' || !job.selectedPackage) notFound();

  const assets = visibleGalleryAssets(job.gallery.assets, job.selectedPackage, job.includedImageCount);
  return (
    <GalleryDownload
      token={token}
      eventTitle={job.eventTitle}
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
