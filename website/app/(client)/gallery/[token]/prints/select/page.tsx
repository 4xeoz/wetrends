import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import PrintShop from '@/app/_component/events/print-shop';
import { PRINT_PRODUCTS } from '@/lib/events/catalog';
import { getEventJobFromToken, visibleGalleryAssets } from '@/lib/events/queries';

export const metadata: Metadata = {
  title: 'Choose photographs for print | WeTrends',
  robots: { index: false, follow: false },
};

export default async function SelectPrintsPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ cancelled?: string; products?: string }>;
}) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  const job = await getEventJobFromToken(token);
  if (!job?.gallery || job.gallery.status !== 'PUBLISHED' || !job.selectedPackage) notFound();

  const requestedProductIds = new Set((query.products || '').split(',').filter(Boolean));
  const products = PRINT_PRODUCTS.filter((product) => requestedProductIds.has(product.id));
  if (products.length === 0) redirect(`/gallery/${token}/prints`);

  const assets = visibleGalleryAssets(job.gallery.assets, job.selectedPackage, job.includedImageCount);
  return (
    <PrintShop
      token={token}
      eventTitle={job.eventTitle}
      currency={job.currency}
      cancelled={query.cancelled === '1'}
      products={products}
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
