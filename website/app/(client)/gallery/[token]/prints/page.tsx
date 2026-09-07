import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PrintProductPicker from '@/app/_component/events/print-product-picker';
import { PRINT_PRODUCTS } from '@/lib/events/catalog';
import { getEventJobFromToken } from '@/lib/events/queries';

export const metadata: Metadata = {
  title: 'Order event prints | WeTrends',
  robots: { index: false, follow: false },
};

export default async function PrintsPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const job = await getEventJobFromToken(token);
  if (!job?.gallery || job.gallery.status !== 'PUBLISHED' || !job.selectedPackage) notFound();

  return (
    <PrintProductPicker
      token={token}
      eventTitle={job.eventTitle}
      currency={job.currency}
      products={PRINT_PRODUCTS}
    />
  );
}
