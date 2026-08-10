'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import type { FoodShoot } from '@/lib/food-photography-data';
import Reveal from './reveal';

/**
 * Food photography, as a section of the portfolio page rather than a page of
 * its own — five shoots, each a cover in the grid, each opening its full set in
 * an overlay. No routing: the whole thing lives at /case-studies/.
 *
 * Shoots are titled by what was on the plate, never by who commissioned them.
 * Same reason the files under /public/food are renamed: a client name in an
 * <img src> is still a client name.
 */
export default function FoodSection({ shoots }: { shoots: FoodShoot[] }) {
  const [open, setOpen] = useState<FoodShoot | null>(null);

  // Esc closes, and the page behind must not scroll while the overlay owns the
  // viewport — otherwise closing dumps you somewhere else on the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <section className="bg-[#0F0F0F] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between border-b border-white/20 pb-4">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
            Food photography
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
            {String(shoots.length).padStart(2, '0')} sets
          </span>
        </div>

        <Reveal>
          <p className="mt-8 max-w-xl text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl">
            Menu and delivery shoots —{' '}
            <span className="font-serif font-thin italic text-[#C72C5B]">
              shot to be ordered.
            </span>
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {shoots.map((shoot, i) => (
            <Reveal key={shoot.slug} delay={(i % 3) * 0.08}>
              <button
                type="button"
                onClick={() => setOpen(shoot)}
                className="group block w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F]"
              >
                {/* Covers crop to 4:5 whatever the source ratio — a ragged grid
                    of natural ratios reads as a contact sheet, and the contact
                    sheet belongs inside the overlay. Hover cross-fades to the
                    set's first single-item frame: two stacked images and an
                    opacity swap, no JS. */}
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src={shoot.hero.src}
                    alt={`${shoot.title} food photography by WeTrends`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0"
                  />
                  <Image
                    src={shoot.photos[0].src}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="scale-[1.04] object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                    {shoot.category}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-white/40">
                        {shoot.number}
                      </span>
                      <h3 className="text-lg font-bold tracking-tight text-white">
                        {shoot.title}
                      </h3>
                    </div>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                      {shoot.frames} frames
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Plain conditional render, deliberately not AnimatePresence: an exit
          animation here left the overlay mounted at opacity 0 over the whole
          page, eating every click. It fades in and disappears on close. */}
      {open && <ShootOverlay shoot={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

/**
 * The full set, over the page. Frames keep their own aspect ratios in a
 * CSS-columns masonry — the sources run from 480x322 to 1312x954, and cropping
 * them to a uniform tile throws away the plating, which is the product.
 */
function ShootOverlay({
  shoot,
  onClose,
}: {
  shoot: FoodShoot;
  onClose: () => void;
}) {
  // z-[60] clears the fixed nav (z-50) — the overlay owns the viewport.
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-[#0A0A0A]"
      role="dialog"
      aria-modal="true"
      aria-label={`${shoot.title} — full set`}
      onClick={onClose}
    >
      <div
        className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 border-b border-white/15 pb-5">
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              <span className="mr-3 align-super font-mono text-sm text-[#C72C5B]">
                {shoot.number}
              </span>
              {shoot.title}
            </h3>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              {shoot.category} · {shoot.frames} frames
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full border border-white/15 p-2.5 text-white/70 transition-colors hover:border-white/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl">
          <Image
            src={shoot.hero.src}
            alt={`${shoot.title} header composition by WeTrends`}
            width={shoot.hero.width}
            height={shoot.hero.height}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="mt-5 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {shoot.photos.map((photo, i) => (
            <div key={photo.src} className="overflow-hidden rounded-xl">
              <Image
                src={photo.src}
                alt={`${shoot.title} — frame ${String(i + 1).padStart(2, '0')} by WeTrends`}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full"
                loading={i < 3 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
