import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Download } from 'lucide-react';
import { notFound } from 'next/navigation';
import { GalleryHeader, GallerySteps } from '@/app/_component/events/gallery-chrome';
import { getEventJobFromToken } from '@/lib/events/queries';

export const metadata: Metadata = {
  title: 'Download ready | WeTrends',
  robots: { index: false, follow: false },
};

export default async function GalleryDonePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const job = await getEventJobFromToken(token);
  if (!job?.gallery || job.gallery.status !== 'PUBLISHED' || !job.selectedPackage) notFound();

  return (
    <main className="min-h-screen bg-[#F7F4F2] text-[#0F0F0F]">
      <GalleryHeader token={token} eventTitle={job.eventTitle} backHref={`/gallery/${token}/download`} backLabel="Downloads" />
      <GallerySteps active={4} completeCurrent labels={['View', 'Frames', 'Downloads', 'Done']} />
      <section className="relative isolate grid min-h-[calc(100svh-166px)] place-items-center overflow-hidden border-t border-black/[0.06] px-4 py-12">
        <Image src="/images/events-mesh-light.png?v=brand-magenta" alt="" fill priority sizes="100vw" className="pointer-events-none absolute inset-0 object-cover" />
        <div className="absolute inset-0 bg-white/35" />
        <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white/90 p-8 text-center shadow-[0_30px_90px_rgba(86,24,45,0.15)] backdrop-blur-xl sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#C72C5B] text-white">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">04 · Done</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">Your download has started.</h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-black/55">
            Your selected photographs are being saved as one ZIP file. If your browser asks, choose where to keep it.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={`/gallery/${token}/download`} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-bold transition hover:border-black/25">
              <Download className="h-4 w-4" /> Download more
            </Link>
            <Link href={`/gallery/${token}`} className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#C72C5B] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#A91F49]">Return to your gallery</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
