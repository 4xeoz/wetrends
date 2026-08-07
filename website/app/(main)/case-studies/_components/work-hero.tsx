'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import { reelPreviewUrl, reelPosterUrl } from '@/lib/cloudinary';

/**
 * Centred statement hero: one sentence carrying the page, with media set inline
 * as pills so the work itself is part of the typography rather than a separate
 * gallery below it.
 *
 * Type scale, the `font-serif italic font-thin` accent, and the pill CTA with
 * its rotating arrow badge are all lifted from the home hero
 * (`app/_component/home/hero.tsx`) so the two pages read as one site.
 *
 * All three pills are live reels rather than the case-study mockups. Those
 * mockups are multi-image collages — cropped down to ~40px of pill they read as
 * noise. Reels are already vertical and single-subject, so they survive the
 * crop, and a headline that moves is the right advert for a video agency.
 *
 * Height is capped at 76svh so the reel rails below break the fold and show
 * through on landing, rather than the page reading as stacked slabs.
 */

/**
 * Two-layer shadow: a tight contact shadow plus a wider ambient one, which
 * reads as solid where a single soft blur reads as haze. Offsets are positive
 * x/y so the pills drop down-right, matching the light streaks entering from
 * the top-left of the section.
 *
 * Units are `em` rather than `px` so the shadow scales with the headline — the
 * type runs 2rem on mobile up to text-7xl on desktop, and a fixed px shadow
 * looks heavy-handed at the small end and weightless at the large one.
 */
const PILL =
  'relative inline-block overflow-hidden border border-[#0F0F0F] border-2 align-middle shadow-[0.04em_0.08em_0.16em_-0.02em_rgba(15,15,15,0.50),0.015em_0.03em_0.05em_rgba(15,15,15,0.38)]';

/**
 * Chosen off a contact sheet of all 18 for legibility at ~40px of pill: each is
 * a single high-contrast subject, and the three sit in different colour
 * families (red / neutral portrait / blue-gold) so they don't smear together.
 * Reels full of fine type or pale product shots turn to grey mush at this size.
 */
const PILL_REELS = ['vid-10_lqjnoe', 'vid-04_msrhdo', 'vid-14_hvqmdq'] as const;

/** Entrance finishes by ~1s, so the logo aperture reveals a settled hero. */
const line = (delay: number) => ({
  initial: { opacity: 0, y: 34 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function PillReel({ id, className }: { id: string; className: string }) {
  return (

    <span className={`${PILL} ${className}`} aria-hidden>
      <video
        src={reelPreviewUrl(id)}
        poster={reelPosterUrl(id, 240)}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover "
      />
    </span>

  );
}

export default function WorkHero() {
  return (
    <section className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden bg-[#F4F4F5] pb-12 pt-32 md:min-h-[85svh] md:pb-16 md:pt-40">
      {/* Soft light wash + blurred diagonal streaks, so the flat grey reads as
          lit rather than painted. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, #ffffff 0%, #f4f4f5 55%, #ececee 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-3f/4 h-[42rem] w-16 -rotate-[25deg] bg-black/20 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-24 -rotate-[25deg] bg-black/20 blur-3xl"
      />
            <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[10%] h-[42rem] w-24 -rotate-[25deg] bg-black/20 blur-3xl"
      />

      {/* Content sits bottom-left in a max-w-7xl rail, matching the services
          hero (app/(main)/services/page.tsx): small tracked label, one oversized
          clamp headline at leading-[0.85], second line in serif italic accent. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          {...line(0.05)}
          className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#C72C5B]"
        >
          Selected Work
        </motion.p>

        <h1 className="max-w-5xl text-[clamp(2.5rem,9vw,8rem)] font-bold leading-[0.85] tracking-tight text-[#0F0F0F]">
          <motion.span {...line(0.15)} className="block">
            It will make you{' '}
            <PillReel
              id={PILL_REELS[0]}
              className="h-[0.72em] w-[1.3em] rounded-full"
            />
          </motion.span>
          <motion.span {...line(0.25)} className="block">
            go{' '}
            <span className="font-serif font-thin italic text-[#C72C5B]">
              woooow.
            </span>{' '}
            <PillReel
              id={PILL_REELS[1]}
              className="h-[0.76em] w-[1.15em] rounded-[0.35em]"
            />{' '}
            <PillReel
              id={PILL_REELS[2]}
              className="h-[0.72em] w-[1.3em] rounded-full"
            />
          </motion.span>
        </h1>

        <motion.div {...line(0.4)} className="mt-8 md:mt-10">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-[#0F0F0F] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#C72C5B] sm:px-7 sm:py-3.5 sm:text-base md:px-8"
          >
            Start Your Project
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#C72C5B] transition-transform group-hover:rotate-45 group-hover:scale-110 sm:h-8 sm:w-8">
              <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
