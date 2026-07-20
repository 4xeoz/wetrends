'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/case-studies-data';
import Reveal from './reveal';

export default function CaseIndex({ studies }: { studies: CaseStudy[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStudy = studies[activeIndex];

  return (
    <>
      {/* ── Intro hero ─────────────────────────────────────── */}
      <section className="relative flex min-h-[60svh] flex-col justify-center overflow-hidden bg-[#0B0B0C] px-4 pt-24 pb-16 sm:px-6 lg:px-8">
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
            <h1 className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Proof,
              <br />
              <span className="font-serif text-[#C72C5B] font-normal italic">
                not promises
              </span>
            </h1>
          </Reveal>

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <Reveal delay={0.15}>
              <p className="max-w-md text-lg leading-relaxed text-white/55">
                Hover the list, watch the work change. Then dive into the story.
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
      </section>

      {/* ── Split-screen hover index ───────────────────────── */}
      <section className="relative min-h-screen bg-[#0B0B0C]">
        <div className="grid lg:grid-cols-2">
          {/* Left: sticky list */}
          <div className="order-2 px-4 py-12 sm:px-6 lg:sticky lg:top-0 lg:order-1 lg:h-screen lg:px-8 lg:py-0">
            <div className="flex h-full flex-col justify-center">
              {studies.map((study, i) => (
                <Link
                  key={study.slug}
                  href={`/case-studies/${study.slug}/`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  className="group border-b border-white/10 transition-colors hover:bg-white/5 focus:outline-none"
                >
                  <div
                    className={`flex items-center justify-between py-6 md:py-7 ${
                      activeIndex === i ? 'bg-white/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <span
                        className="text-lg font-bold transition-transform duration-300 group-hover:translate-x-1 md:text-xl"
                        style={{ color: study.accentColor }}
                      >
                        {study.number}
                      </span>
                      <h2 className="text-2xl font-bold text-white transition-colors group-hover:text-white/80 md:text-3xl lg:text-4xl">
                        {study.client}
                      </h2>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className="hidden text-lg font-bold md:block"
                        style={{ color: study.accentColor }}
                      >
                        {study.metric}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: sticky preview image */}
          <div className="relative order-1 h-[50vh] lg:sticky lg:top-0 lg:order-2 lg:h-screen">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStudy.slug}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={activeStudy.image || '/images/nopeca-mockup.webp'}
                  alt={`${activeStudy.client} project by WeTrends`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/70 via-[#0B0B0C]/20 to-transparent lg:bg-gradient-to-r lg:from-[#0B0B0C]/50 lg:via-transparent lg:to-transparent" />

            {/* Floating info card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStudy.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white p-5 shadow-2xl sm:bottom-8 sm:left-8 sm:right-auto sm:max-w-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: activeStudy.accentColor }}
                  >
                    {activeStudy.industry}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
                    {activeStudy.year}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-bold text-[#0F0F0F]">
                  {activeStudy.client}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {activeStudy.tagline}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: activeStudy.accentColor }}
                  >
                    {activeStudy.metric}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {activeStudy.metricLabel}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
