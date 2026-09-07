'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Check, CheckSquare2, Download, Share2 } from 'lucide-react';
import { DownloadShareDialog } from './gallery-share';
import { GalleryHeader, GallerySteps } from './gallery-chrome';

type GalleryAsset = {
  id: string;
  title: string;
  alt: string;
  previewUrl: string;
  downloadUrl: string;
};

export default function GalleryDownload({
  token,
  eventTitle,
  assets,
}: {
  token: string;
  eventTitle: string;
  assets: GalleryAsset[];
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [downloadOpen, setDownloadOpen] = useState(false);
  const selectedAssets = useMemo(() => assets.filter((asset) => selectedIds.has(asset.id)), [assets, selectedIds]);
  const allSelected = assets.length > 0 && selectedIds.size === assets.length;

  function toggleAsset(assetId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(assetId)) next.delete(assetId);
      else next.add(assetId);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds(allSelected ? new Set() : new Set(assets.map((asset) => asset.id)));
  }

  return (
    <main className={`min-h-screen bg-[#F7F4F2] text-[#0F0F0F] ${selectedIds.size > 0 ? 'pb-40' : ''}`}>
      <GalleryHeader token={token} eventTitle={eventTitle} backHref={`/gallery/${token}/prints`} backLabel="Print options" />
      <GallerySteps active={3} labels={['View', 'Frames', 'Downloads', 'Done']} />

      <section className="relative isolate overflow-hidden border-y border-black/[0.06] px-4 py-12 sm:px-6 sm:py-16">
        <Image src="/images/events-mesh-light.png?v=brand-magenta" alt="" fill priority sizes="100vw" className="pointer-events-none absolute inset-0 object-cover" />
        <div className="absolute inset-0 bg-white/35" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">03 · Choose your downloads</p>
            <h1 className="mt-4 text-[clamp(3rem,6vw,6rem)] font-bold leading-[0.88] tracking-[-0.06em]">Choose the moments<br /><span className="font-serif font-normal italic text-[#C72C5B]">you want to keep.</span></h1>
          </div>
          <button type="button" onClick={toggleAll} className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-xs font-bold transition hover:border-[#C72C5B] hover:text-[#C72C5B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B]">
            <CheckSquare2 className="h-4 w-4" /> {allSelected ? 'Clear all' : 'Select all'}
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-3 py-8 sm:px-5 sm:py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C72C5B]">Your photographs</p>
            <p className="mt-1 text-sm text-black/45">{selectedIds.size} of {assets.length} selected</p>
          </div>
          {selectedIds.size > 0 && <button type="button" onClick={() => setSelectedIds(new Set())} className="text-xs font-bold text-black/45 transition hover:text-black">Clear selection</button>}
        </div>

        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {assets.map((asset, index) => {
            const selected = selectedIds.has(asset.id);
            return (
              <motion.figure
                key={asset.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.24) }}
                className={`group relative mb-3 break-inside-avoid overflow-hidden rounded-2xl bg-[#E9E2E0] transition ${selected ? 'ring-4 ring-[#C72C5B] ring-offset-2 ring-offset-[#F7F4F2]' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => toggleAsset(asset.id)}
                  aria-label={`${selected ? 'Deselect' : 'Select'} ${asset.title}`}
                  aria-pressed={selected}
                  className="relative block w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C72C5B] focus-visible:ring-inset"
                >
                  <Image src={asset.previewUrl} alt={asset.alt} width={900} height={index % 3 === 0 ? 1125 : 720} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                  <span className={`absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent transition ${selected ? 'opacity-90' : 'opacity-65 group-hover:opacity-85'}`} />
                  <span className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border-2 shadow-lg backdrop-blur-sm transition ${selected ? 'border-[#C72C5B] bg-[#C72C5B] text-white' : 'border-white bg-black/20 text-transparent'}`}>
                    <Check className="h-5 w-5" strokeWidth={3} />
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 text-white">
                    <span className="text-sm font-bold">{asset.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{selected ? 'Selected' : 'Select'}</span>
                  </span>
                </button>
              </motion.figure>
            );
          })}
        </div>
      </section>

      {selectedIds.size > 0 && (
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-4xl flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-[#12090D]/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div>
            <p className="text-sm font-bold">{selectedIds.size} {selectedIds.size === 1 ? 'photo' : 'photos'} selected</p>
            <p className="mt-1 hidden text-[11px] text-white/45 sm:block">Your download will be prepared as one ZIP file.</p>
          </div>
          <button type="button" onClick={() => setDownloadOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-xs font-bold text-black transition hover:bg-[#FFF0F4]">
            <Download className="h-4 w-4" /> Download selected
          </button>
        </motion.aside>
      )}

      <div className="border-t border-black/[0.06] bg-white px-4 py-5 text-center text-[11px] text-black/45">
        <Share2 className="mr-1.5 inline h-3.5 w-3.5 align-[-3px] text-[#C72C5B]" /> Shared links always open at the beginning of this private gallery.
      </div>

      <DownloadShareDialog
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        token={token}
        eventTitle={eventTitle}
        assets={selectedAssets}
        completionHref={`/gallery/${token}/done`}
      />
    </main>
  );
}
