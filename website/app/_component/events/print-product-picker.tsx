'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Check, Download, ImageIcon, Sparkles } from 'lucide-react';
import { formatMoney } from '@/lib/events/catalog';
import { GalleryHeader, GallerySteps } from './gallery-chrome';

type Product = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  unitAmount: number;
  mockupImage: string;
};

export default function PrintProductPicker({
  token,
  eventTitle,
  currency,
  products,
}: {
  token: string;
  eventTitle: string;
  currency: string;
  products: Product[];
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const continueHref = useMemo(() => {
    const query = new URLSearchParams({ products: [...selectedIds].join(',') });
    return `/gallery/${token}/prints/select?${query.toString()}`;
  }, [selectedIds, token]);

  function toggleProduct(productId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-[#F7F4F2] pb-8 text-[#0F0F0F]">
      <GalleryHeader token={token} eventTitle={eventTitle} backHref={`/gallery/${token}`} backLabel="Gallery" />
      <GallerySteps active={2} />

      <section className="relative isolate overflow-hidden border-y border-black/[0.06] px-4 py-14 sm:px-6 sm:py-20">
        <Image src="/images/events-mesh-light.png?v=brand-magenta" alt="" fill priority sizes="100vw" className="pointer-events-none absolute inset-0 object-cover" />
        <div className="absolute inset-0 bg-white/35" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C72C5B]">02 · Choose a frame</p>
          <h1 className="mt-4 text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.87] tracking-[-0.06em]">Frame a favourite.<br /><span className="font-serif font-normal italic text-[#C72C5B]">Keep it close.</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-black/50 sm:text-base">Choose one or both sizes. You will pick the photographs and quantities next.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {products.map((product, index) => {
            const selected = selectedIds.has(product.id);
            return (
              <motion.button
                key={product.id}
                type="button"
                onClick={() => toggleProduct(product.id)}
                aria-pressed={selected}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`group relative overflow-hidden rounded-[1.8rem] border-2 bg-white text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C72C5B]/25 ${selected ? 'border-[#C72C5B] shadow-[0_24px_70px_rgba(199,44,91,0.2)]' : 'border-transparent shadow-[0_16px_50px_rgba(26,12,18,0.08)] hover:-translate-y-1 hover:border-[#C72C5B]/35'}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE7E5]">
                  <Image src={product.mockupImage} alt={`${product.name} product mockup`} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                  <span className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
                  {index === 0 && <span className="absolute left-4 top-4 rounded-full bg-[#12090D] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white">Most popular</span>}
                  <span className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border-2 shadow-lg backdrop-blur ${selected ? 'border-white bg-[#C72C5B] text-white' : 'border-white bg-black/15 text-transparent'}`}>
                    <Check className="h-5 w-5" strokeWidth={3} />
                  </span>
                </div>
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-2xl font-bold tracking-[-0.035em]">{product.name.split(' · ')[0]}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#C72C5B]">{product.shortName}</p>
                    </div>
                    <p className="whitespace-nowrap text-lg font-bold">{formatMoney(product.unitAmount, currency)}</p>
                  </div>
                  <p className="mt-5 min-h-10 text-sm leading-relaxed text-black/50">{product.description}</p>
                  <span className={`mt-6 inline-flex items-center gap-2 text-xs font-bold ${selected ? 'text-[#C72C5B]' : 'text-black/45'}`}>
                    {selected ? <><Check className="h-4 w-4" /> Selected</> : <><ImageIcon className="h-4 w-4" /> Select frame</>}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] bg-[#12090D] p-6 text-center text-white shadow-[0_28px_90px_rgba(32,12,21,0.18)] sm:p-8">
          <Sparkles className="mx-auto h-6 w-6 text-[#F08BAB]" />
          <p className="mt-4 text-2xl font-bold tracking-[-0.035em]">{selectedIds.size > 0 ? `${selectedIds.size} ${selectedIds.size === 1 ? 'frame' : 'frames'} selected` : 'Choose a frame to continue'}</p>
          <p className="mt-2 text-xs text-white/45">You will choose the photos and quantities on the next page.</p>
          {selectedIds.size > 0 ? (
            <Link href={continueHref} className="group mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#C72C5B] px-6 text-sm font-bold text-white transition hover:bg-white hover:text-[#12090D]">
              Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <button type="button" disabled className="mt-6 inline-flex min-h-14 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-white/10 px-6 text-sm font-bold text-white/35">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-14 border-t border-black/[0.08] pt-8 text-center">
          <p className="text-xs text-black/40">Not ordering prints today?</p>
          <Link href={`/gallery/${token}/download`} className="group mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 text-xs font-bold text-black transition hover:border-black/25">
            <Download className="h-4 w-4" /> Skip to downloads <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
