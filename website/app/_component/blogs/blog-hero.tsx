'use client';

import { motion } from 'motion/react';

/**
 * The portfolio hero (`app/(main)/case-studies/_components/work-hero.tsx`) with
 * different copy on warm paper instead of cool grey. Structure is deliberately
 * identical — change one and change the other.
 */

/** Entrance finishes by ~1s, so the logo aperture reveals a settled hero. */
const line = (delay: number) => ({
  initial: { opacity: 0, y: 34 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function BlogHero() {
  return (
    <section className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden pb-12 pt-32 md:min-h-[85svh] md:pb-16 md:pt-40">
      {/* Soft light wash + blurred diagonal streaks, so the flat paper reads as
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
        className="pointer-events-none absolute -top-40 left-3/4 h-[42rem] w-16 -rotate-[25deg] bg-black/20 blur-2xl"
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
          Insights &amp; Ideas
        </motion.p>

        <h1 className="max-w-5xl text-[clamp(2.5rem,9vw,8rem)] font-bold leading-[0.95] tracking-tight text-[#0F0F0F]">
          <motion.span {...line(0.15)} className="block">
            Notes from
          </motion.span>

          <motion.span {...line(0.25)} className="block">
            <span className="font-serif font-thin italic text-[#C72C5B]">
              the Workshop.
            </span>
          </motion.span>
        </h1>
      </div>
    </section>
  );
}
