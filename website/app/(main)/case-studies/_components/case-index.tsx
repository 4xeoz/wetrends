'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/case-studies-data';
import Reveal from './reveal';
import CasePoster from './case-poster';

export default function CaseIndex({ studies }: { studies: CaseStudy[] }) {
  const marquee = [
    ...studies.map((s) => `${s.metric} ${s.metricLabel}`),
    'Guildford · Surrey · UK',
    'Brand · Web · Motion',
  ];

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative flex min-h-[88svh] flex-col justify-center overflow-hidden bg-[#0B0B0C] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[#C72C5B] opacity-20 blur-[140px]"
        />

        <div className="relative mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
              <span className="h-px w-8 bg-white/30" />
              WeTrends — Selected Work
            </div>
          </Reveal>

          <Reveal delay={0.05} y={40}>
            <h1 className="text-[clamp(3rem,12vw,10rem)] font-black uppercase leading-[0.82] tracking-[-0.02em] text-white">
              Proof,
              <br />
              <span className="font-serif text-[#C72C5B] font-normal italic normal-case">
                not promises
              </span>
            </h1>
          </Reveal>

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <Reveal delay={0.15}>
              <p className="max-w-md text-lg leading-relaxed text-white/55">
                A closer look at the brands we&apos;ve rebuilt — the problems, the
                craft, and the numbers that followed.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                <span>
                  <span className="text-white">{studies.length}</span> Studies
                </span>
                <span className="h-4 w-px bg-white/20" />
                <span>Scroll to explore</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* marquee */}
        <div className="relative mt-16 overflow-hidden border-y border-white/10 py-4">
          <motion.div
            className="flex shrink-0 gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.2em] text-white/30"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
          >
            {[...marquee, ...marquee].map((item, i) => (
              <span key={i} className="flex items-center gap-10">
                {item}
                <span className="text-[#C72C5B]">✦</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── The Index ──────────────────────────────────────── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {studies.map((study, i) => (
            <IndexRow key={study.slug} study={study} flip={i % 2 === 1} />
          ))}
        </div>
      </section>
    </>
  );
}

function IndexRow({ study, flip }: { study: CaseStudy; flip: boolean }) {
  return (
    <Reveal y={50}>
      <Link
        href={`/case-studies/${study.slug}/`}
        className="group relative block border-t border-gray-200 py-16 md:py-24"
      >
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
            flip ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          {/* Text */}
          <div className="relative">
            <div className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-gray-400">
              <span
                className="text-4xl font-black leading-none md:text-5xl"
                style={{ color: study.accentColor }}
              >
                {study.number}
              </span>
              <span className="h-px flex-1 bg-gray-200" />
              <span>{study.industry}</span>
            </div>

            <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-tight text-[#0F0F0F] transition-colors duration-300 md:text-6xl">
              {study.client}
            </h2>

            <p className="mt-5 max-w-md font-serif text-xl italic text-gray-600 md:text-2xl">
              {study.tagline}
            </p>

            <div className="mt-8 flex items-baseline gap-3">
              <span
                className="text-5xl font-black leading-none tracking-tight md:text-6xl"
                style={{ color: study.accentColor }}
              >
                {study.metric}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {study.metricLabel}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {study.deliverables.map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-gray-200 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-gray-500"
                >
                  {d}
                </span>
              ))}
            </div>

            <div
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              style={{ color: study.accentColor }}
            >
              View case study
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
              style={{ backgroundColor: study.accentColor }}
            />
            <motion.div
              className="relative"
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <CasePoster
                image={study.image}
                client={study.client}
                industry={study.industry}
                accentColor={study.accentColor}
                domain={study.domain}
              />
            </motion.div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
