'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, X } from 'lucide-react';
import type { Reel } from '@/lib/reels-data';
import { reelPreviewUrl, reelFullUrl, reelPosterUrl } from '@/lib/cloudinary';

/**
 * Vertical reels as full-bleed counter-scrolling rails. These are standalone
 * social pieces — they are not tied to a case study, so nothing here links out
 * to one.
 *
 * Shared by the portfolio (`rows={2}`, the whole wall) and the home page
 * (`rows={1}`, a single band above the case studies).
 *
 * Only the poster image loads up front; the <video> mounts when the tile scrolls
 * into view and unmounts when it leaves, so idle cost is JPEGs rather than MP4s.
 */
export default function ReelWall({
  reels,
  rows = 2,
  className = 'bg-[#e9e9e9] pb-16 md:pb-24',
}: {
  reels: Reel[];
  rows?: 1 | 2;
  /** Section chrome, so each page can set its own background and spacing. */
  className?: string;
}) {
  const [open, setOpen] = useState<{ reel: Reel; index: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  // One row still draws from the full set — it just runs them all in a single
  // band rather than splitting them across two.
  const half = rows === 1 ? reels.length : Math.ceil(reels.length / 2);
  const rails =
    rows === 1 ? [reels] : [reels.slice(0, half), reels.slice(half)];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <section className={`overflow-hidden ${className}`}>
      <div className="space-y-4 md:space-y-6">
        {rails.map((rail, railIndex) => (
          <Rail
            key={railIndex}
            reels={rail}
            direction={railIndex === 0 ? 'left' : 'right'}
            offset={railIndex * half}
            onOpen={setOpen}
          />
        ))}
      </div>

      {/* Portalled to <body>: the rails live inside an overflow-hidden section,
          which traps a fixed-position child underneath the fixed nav. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(null)}
              >
                <button
                  onClick={() => setOpen(null)}
                  aria-label="Close reel"
                  className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>

                <motion.video
                  key={open.reel.id}
                  src={reelFullUrl(open.reel.id)}
                  poster={reelPosterUrl(open.reel.id, 1080)}
                  controls
                  autoPlay
                  playsInline
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="max-h-[88svh] w-auto max-w-full rounded-xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}

function Rail({
  reels,
  direction,
  offset,
  onOpen,
}: {
  reels: Reel[];
  direction: 'left' | 'right';
  offset: number;
  onOpen: (value: { reel: Reel; index: number }) => void;
}) {
  const [paused, setPaused] = useState(false);
  const track = [...reels, ...reels];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex w-max gap-3 md:gap-5"
        style={{
          animation: `wt-marquee-${direction} 55s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {track.map((reel, i) => (
          <ReelCard
            key={`${reel.id}-${i}`}
            reel={reel}
            index={offset + (i % reels.length)}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}

function ReelCard({
  reel,
  index,
  onOpen,
}: {
  reel: Reel;
  index: number;
  onOpen: (value: { reel: Reel; index: number }) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);

  /**
   * Tiles play on their own, but only while actually on screen. The rails hold
   * 36 tiles between them; mounting every <video> at once would pull tens of
   * megabytes for reels nobody has scrolled to. The observer keeps that down to
   * the handful in the viewport, and reduced-motion users keep still posters.
   */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { rootMargin: '100px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen({ reel, index })}
      aria-label={reel.label ? `Play reel: ${reel.label}` : `Play reel ${index + 1}`}
      className="group relative aspect-[9/16] w-36 shrink-0 overflow-hidden rounded-lg bg-gray-100 transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B] focus-visible:ring-offset-2 sm:w-44 md:w-52"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={reelPosterUrl(reel.id)}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {playing && (
        <video
          src={reelPreviewUrl(reel.id)}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* The tile is already playing, so the hover affordance is about sound,
          not starting playback. */}
      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="rounded-full bg-white/90 p-3 text-[#0F0F0F]">
          <Volume2 className="h-4 w-4" />
        </span>
      </span>

      <span className="absolute bottom-3 left-3 right-3 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {reel.label || String(index + 1).padStart(2, '0')}
      </span>
    </button>
  );
}
