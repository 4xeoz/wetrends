'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { caseStudies as allCaseStudies } from '@/lib/case-studies-data';

const caseStudies = allCaseStudies.map((s) => ({
  id: s.number,
  client: s.client,
  service: s.service,
  year: s.year,
  metric: s.metric,
  metricLabel: s.metricLabel,
  description: s.tagline,
  href: `/case-studies/${s.slug}/`,
  image: s.image,
  color: s.accentColor,
}));

export function CaseStudies() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="case-studies" className="relative bg-white">
      {/* ── Header ─────────────────────────────────────────── */}
      <div
        ref={headerRef}
        className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
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
            Real results for ambitious brands. Scroll down to see the stories stack up.
          </p>
        </motion.div>
      </div>

      {/* ── Stacked cards ──────────────────────────────────── */}
      <div className="relative">
        {caseStudies.map((study, index) => (
          <StudyCard key={study.id} study={study} index={index} />
        ))}
      </div>

      {/* ── Bottom CTA ─────────────────────────────────────── */}
      <div className="relative z-50 bg-white px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 sm:flex-row"
        >
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
        </motion.div>
      </div>
    </section>
  );
}

function StudyCard({
  study,
  index,
}: {
  study: (typeof caseStudies)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-20% 0px' });

  return (
    <div
      ref={cardRef}
      className="sticky h-screen"
      style={{
        top: `${index * 40}px`,
        zIndex: index + 10,
      }}
    >
      <Link
        href={study.href}
        className="group relative block h-full w-full overflow-hidden"
      >
        {/* Background image */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {study.image ? (
            <Image
              src={study.image}
              alt={`${study.client} project by WeTrends`}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
              priority={index < 2}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: study.color }}
            >
              <span className="text-center text-6xl font-black uppercase leading-none tracking-tight text-white md:text-8xl">
                {study.client}
              </span>
            </div>
          )}
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/60 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 pb-24 sm:p-10 sm:pb-32 lg:p-16 lg:pb-40">
          {/* Top: number + service badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <span
              className="text-6xl font-black leading-none text-white/20 md:text-8xl"
              style={{ textShadow: `0 0 60px ${study.color}40` }}
            >
              {study.id}
            </span>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#0F0F0F]">
                {study.service}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                {study.year}
              </span>
            </div>
          </motion.div>

          {/* Bottom: client info */}
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-baseline gap-4">
                <h3 className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  {study.client}
                </h3>
                <span
                  className="hidden text-3xl font-bold sm:block md:text-4xl"
                  style={{ color: study.color }}
                >
                  {study.metric}
                </span>
              </div>

              <p className="mt-4 max-w-xl text-lg text-white/70 md:text-xl">
                {study.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white transition-colors group-hover:text-white/80">
                  View Case Study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span
                  className="text-sm font-semibold uppercase tracking-wide text-white/50"
                  style={{ color: study.color }}
                >
                  {study.metric} {study.metricLabel}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </Link>
    </div>
  );
}
