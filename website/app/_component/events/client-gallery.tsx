'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Maximize2, Printer, Share2, X } from 'lucide-react';
import { GalleryHeader, GallerySteps } from './gallery-chrome';

type GalleryAsset = {
  id: string;
  title: string;
  alt: string;
  previewUrl: string;
  downloadUrl: string;
};

export default function ClientGallery({
  clientName,
  eventTitle,
  packageLabel,
  assets,
  token,
}: {
  clientName: string;
  eventTitle: string;
  packageLabel: string;
  assets: GalleryAsset[];
  token: string;
}) {
  const [active, setActive] = useState<GalleryAsset | null>(null);
  const rawFirstName = clientName.trim().split(/\s+/)[0] || 'there';
  const firstName = rawFirstName === 'there'
    ? rawFirstName
    : `${rawFirstName.charAt(0).toUpperCase()}${rawFirstName.slice(1)}`;

  return (
    <main className="min-h-screen bg-[#F7F4F2] text-[#0F0F0F]">
      <GalleryHeader token={token} eventTitle={eventTitle} nextHref={`/gallery/${token}/prints`} nextLabel="Next" />
      <GallerySteps active={1} />

      <section className="relative isolate overflow-hidden border-b border-black/[0.06] px-4 py-16 text-center sm:px-6 sm:py-20">
        <Image src="/images/events-mesh-light.png?v=brand-magenta" alt="" fill priority sizes="100vw" className="pointer-events-none absolute inset-0 object-cover" />
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">{packageLabel}</p>
          <h1 className="mt-4 text-[clamp(3.4rem,8vw,7rem)] font-bold leading-[0.86] tracking-[-0.06em]">{eventTitle}</h1>
          <p className="mt-6 text-base text-black/50">{`Here they are, ${firstName}. Tap any photograph to see it properly, then continue when you are ready.`}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-3 py-8 sm:px-5 sm:py-12">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Your photographs</p>
            <p className="mt-1 text-sm text-black/45">{assets.length} {assets.length === 1 ? 'photograph' : 'photographs'} · tap to view</p>
          </div>
          <p className="text-xs font-bold text-black/35">Selection comes next</p>
        </div>

        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {assets.map((asset, index) => (
              <motion.figure
                key={asset.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.035, 0.3) }}
                className="group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-[#E9E2E0]"
              >
                <button
                  type="button"
                  onClick={() => setActive(asset)}
                  aria-label={`Open ${asset.title}`}
                  className="relative block w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C72C5B] focus-visible:ring-inset"
                >
                  <Image src={asset.previewUrl} alt={asset.alt} width={900} height={index % 3 === 0 ? 1125 : 720} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" />
                  <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 text-white">
                    <span className="text-sm font-bold">{asset.title}</span>
                    <Maximize2 className="h-4 w-4" />
                  </span>
                </button>
              </motion.figure>
          ))}
        </div>
      </section>

      <section className="bg-[#12090D] px-4 py-16 text-center text-white sm:px-6 sm:py-20">
        <Printer className="mx-auto h-7 w-7 text-[#F08BAB]" />
        <h2 className="mt-5 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">Ready for the next step?</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/50">See how your favourites could look in print, or skip straight to downloads.</p>
        <Link href={`/gallery/${token}/prints`} className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          Next <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] grid place-items-center bg-black/92 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label={active.title}>
            <button type="button" aria-label="Close photograph" onClick={() => setActive(null)} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B]"><X className="h-5 w-5" /></button>
            <div className="relative h-full max-h-[88vh] w-full max-w-6xl">
              <Image src={active.previewUrl} alt={active.alt} fill sizes="100vw" className="object-contain" priority />
            </div>
            <Link href={`/gallery/${token}/prints`} className="absolute bottom-5 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-black">
              Next <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-black/[0.06] bg-white px-4 py-5 text-center text-[11px] text-black/45">
        <Share2 className="mr-1.5 inline h-3.5 w-3.5 align-[-3px] text-[#C72C5B]" /> Anyone with this private link can view, download and order prints.
      </div>
    </main>
  );
}
