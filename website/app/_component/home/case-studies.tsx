'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { caseStudies } from '@/lib/case-studies-data';
import { reels } from '@/lib/reels-data';
import ReelWall from '@/components/reels/reel-wall';

/**
 * Home "selected work": a full-bleed band of autoplaying reels, then four case
 * studies as large 2x2 cards.
 *
 * This replaces the previous five full-height sticky-stacked panels, which cost
 * five screens of scroll to say what the grid says in one.
 *
 * The cards deliberately do not repeat the portfolio's card (image on top,
 * white text footer). Here the copy sits *inside* the card over a flat
 * background with the mockup inset beneath it, so both pages can show the same
 * work without looking like the same component.
 *
 * Four, not five — a 2x2 grid with a lone fifth reads as a bug, and this
 * section exists to send people to /case-studies rather than replace it.
 */
const featured = caseStudies.slice(0, 4);

export function CaseStudies() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="case-studies" className="relative bg-white">
      <div
        ref={headerRef}
        className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-32"
      >
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]"
        >
          <span className="h-px w-8 bg-[#C72C5B]" />
          Selected Work
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <h2 className="text-4xl font-bold leading-[0.95] text-[#0F0F0F] sm:text-5xl md:text-6xl lg:text-7xl">
            Work That
            <br />
            <span className="font-serif italic text-[#C72C5B]">Speaks</span>
          </h2>

          <p className="max-w-md text-lg text-gray-500 lg:text-right">
            Brands we&apos;ve built, films we&apos;ve shot, and the numbers that
            came out of them.
          </p>
        </motion.div>
      </div>

      {/* Full-bleed reel band — the same component the portfolio uses, one row. */}
      <ReelWall reels={reels} rows={1} className="bg-white pb-14 md:pb-20" />

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {featured.map((study, i) => (
            <StudyCard key={study.slug} study={study} dark={i % 2 === 1} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/case-studies/"
            className="group inline-flex items-center gap-3 rounded-full bg-[#0F0F0F] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#C72C5B]"
          >
            View All Work
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 rounded-full border-2 border-gray-200 px-8 py-4 text-base font-bold text-[#0F0F0F] transition-all hover:border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white"
          >
            Start Your Project
          </Link>
        </div>
      </div>
    </section>
  );
}

function StudyCard({
  study,
  dark,
}: {
  study: (typeof caseStudies)[number];
  dark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/case-studies/${study.slug}/`}
        className="group relative flex aspect-[4/3] flex-col overflow-hidden rounded-3xl p-6 md:p-8"
        style={{ backgroundColor: dark ? '#0F0F0F' : '#EDEEF0' }}
      >
        {/* A wash of the client's own colour under the mockup, so the four cards
            are lit by their brands rather than all sharing one grey. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
          style={{
            background: `radial-gradient(60% 80% at 50% 100%, ${study.accentColor}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <h3
              className={`text-2xl font-bold tracking-tight md:text-3xl ${
                dark ? 'text-white' : 'text-[#0F0F0F]'
              }`}
            >
              {study.client}
            </h3>
            <p
              className={`mt-1.5 max-w-xs text-sm leading-snug ${
                dark ? 'text-white/60' : 'text-gray-500'
              }`}
            >
              {study.tagline}
            </p>
          </div>

          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#0F0F0F] shadow-sm transition-transform duration-300 group-hover:rotate-45 md:h-12 md:w-12">
            <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
          </span>
        </div>

        {/* Inset rather than full-bleed, so the mockup reads as an object placed
            in the card and the title never lands on top of busy artwork. */}
        <div className="relative z-10 mt-5 flex-1 overflow-hidden rounded-xl shadow-2xl">
          <Image
            src={study.image || '/images/nopeca-mockup.webp'}
            alt={`${study.client} project by WeTrends`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>
    </motion.div>
  );
}
