'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/case-studies-data';
import Reveal from '../_components/reveal';
import CountUp from '../_components/count-up';
import CasePoster from '../_components/case-poster';
import ScrollProgress from '../_components/scroll-progress';

export default function CaseStudyDetail({
  study,
  next,
}: {
  study: CaseStudy;
  next: CaseStudy;
}) {
  const accent = study.accentColor;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const posterY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <main className="bg-white" style={{ '--accent': accent } as React.CSSProperties}>
      <ScrollProgress color={accent} />

      <article>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-[#0B0B0C] pb-20 pt-10 md:pb-28"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-20 h-[40rem] w-[40rem] rounded-full opacity-25 blur-[150px]"
            style={{ backgroundColor: accent }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/case-studies/"
              className="inline-flex items-center gap-2 py-6 font-mono text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All Case Studies
            </Link>

            {/* Full-width name so long single-word clients never collide with the poster */}
            <div className="mt-8">
              <Reveal>
                <div className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
                  <span
                    className="rounded-full px-3 py-1 font-bold text-white"
                    style={{ backgroundColor: accent }}
                  >
                    Case {study.number}
                  </span>
                  <span>{study.industry}</span>
                </div>
              </Reveal>

              <Reveal delay={0.05} y={40}>
                <h1 className="text-[clamp(2.75rem,10vw,8rem)] font-black uppercase leading-[0.85] tracking-[-0.02em] text-white">
                  {study.client}
                </h1>
              </Reveal>
            </div>

            <div className="mt-10 grid items-center gap-14 lg:grid-cols-2">
              {/* Left — tagline + meta */}
              <div>
                <Reveal delay={0.12}>
                  <p className="max-w-lg font-serif text-2xl italic leading-snug text-white/70 md:text-3xl">
                    {study.tagline}
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-8 font-mono text-xs uppercase tracking-[0.15em]">
                    {[
                      ['Service', study.service],
                      ['Location', study.location],
                      ['Year', study.year],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-white/40">{label}</dt>
                        <dd className="mt-1 text-sm font-semibold normal-case tracking-normal text-white">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>

              {/* Right — poster + floating metric */}
              <Reveal delay={0.1} y={40} className="relative">
                <motion.div style={{ y: posterY }} className="relative">
                  <CasePoster
                    image={study.image}
                    client={study.client}
                    industry={study.industry}
                    accentColor={accent}
                    domain={study.domain}
                    priority
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 18 }}
                    className="absolute -bottom-8 -left-6 rounded-2xl border border-white/10 bg-white p-5 shadow-2xl md:-left-10"
                  >
                    <div
                      className="text-4xl font-black leading-none tracking-tight md:text-5xl"
                      style={{ color: accent }}
                    >
                      {study.metric}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {study.metricLabel}
                    </div>
                  </motion.div>
                </motion.div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Overview ─────────────────────────────────────── */}
        <section className="border-b border-gray-100 bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-gray-400">
                  Overview
                </span>
                <div className="mt-6 flex flex-wrap gap-2">
                  {study.deliverables.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-gray-200 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-gray-500"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-2xl font-medium leading-snug text-[#0F0F0F] md:text-3xl">
                  {study.description}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── The Challenge ────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#0B0B0C] py-24 md:py-36">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 select-none text-[22vw] font-black leading-none text-white/[0.03]"
          >
            CHALLENGE
          </span>
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <span
                className="font-mono text-xs uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                The Challenge
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-3xl font-medium leading-[1.25] text-white md:text-4xl lg:text-5xl">
                {study.challenge}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── The Approach ─────────────────────────────────── */}
        <section className="bg-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              {/* Sticky heading */}
              <div className="lg:sticky lg:top-28 lg:h-fit">
                <Reveal>
                  <span
                    className="font-mono text-xs uppercase tracking-[0.3em]"
                    style={{ color: accent }}
                  >
                    How we did it
                  </span>
                  <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-tight text-[#0F0F0F] md:text-6xl">
                    Our
                    <br />
                    <span
                      className="font-serif font-normal italic normal-case"
                      style={{ color: accent }}
                    >
                      approach
                    </span>
                  </h2>
                </Reveal>
              </div>

              {/* Steps */}
              <div>
                {study.approach.map((step, i) => (
                  <Reveal key={step.step} delay={i * 0.05}>
                    <div className="group flex gap-6 border-t border-gray-200 py-10 md:gap-10">
                      <span
                        className="text-5xl font-black leading-none tracking-tight text-gray-200 transition-colors duration-300 group-hover:text-[color:var(--accent)] md:text-6xl"
                      >
                        {step.step}
                      </span>
                      <div>
                        <h3 className="text-2xl font-bold text-[#0F0F0F] md:text-3xl">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-lg leading-relaxed text-gray-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── The Results ──────────────────────────────────── */}
        <section className="relative overflow-hidden py-24 md:py-32">
          {/* Same backdrop as the home hero */}
          <Image
            src="/images/hero_background.webp"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-[#0B0B0C]/70" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <span
                className="font-mono text-xs uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                The Results
              </span>
              <h2 className="mt-5 max-w-2xl text-5xl font-black uppercase leading-[0.9] tracking-tight text-white md:text-7xl">
                Numbers that
                <span className="font-serif font-normal italic normal-case text-white/80">
                  {' '}
                  actually moved
                </span>
              </h2>
            </Reveal>

            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {study.results.map((result, i) => (
                <Reveal
                  key={result.label}
                  delay={i * 0.08}
                  className="bg-black/50 backdrop-blur-md"
                >
                  <div className="h-full p-8 md:p-10">
                    <CountUp
                      value={result.value}
                      className="block text-5xl font-black leading-none tracking-tight text-white md:text-6xl"
                    />
                    <div className="mt-4 text-sm font-medium text-white/50">
                      {result.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Next case (story continues) ──────────────────── */}
        <Link
          href={`/case-studies/${next.slug}/`}
          className="group relative block overflow-hidden bg-[#0B0B0C] py-20 md:py-28"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(80% 120% at 80% 50%, ${next.accentColor}33 0%, transparent 60%)`,
            }}
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                Next case — {next.number}
              </span>
              <h2 className="mt-4 text-5xl font-black uppercase leading-[0.85] tracking-tight text-white md:text-7xl">
                {next.client}
              </h2>
              <p className="mt-5 max-w-md font-serif text-xl italic text-white/60">
                {next.tagline}
              </p>
              <span
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                style={{ color: next.accentColor }}
              >
                Read the story
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </div>
            <div className="hidden lg:block">
              <div className="transition-transform duration-500 group-hover:-translate-y-2">
                <CasePoster
                  image={next.image}
                  client={next.client}
                  industry={next.industry}
                  accentColor={next.accentColor}
                  domain={next.domain}
                />
              </div>
            </div>
          </div>
        </Link>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section
          className="py-24 md:py-32"
          style={{ backgroundColor: accent }}
        >
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-black uppercase leading-[0.9] text-white">
                Want results
                <br />
                <span className="font-serif font-normal italic normal-case">
                  like these?
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-xl text-white/80">
                Let&apos;s talk about your project. Free consultation for Guildford
                &amp; Surrey businesses.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <motion.a
                  href="/#contact"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-[#0F0F0F] shadow-lg"
                >
                  Start Your Project
                  <ArrowUpRight className="h-5 w-5" />
                </motion.a>
                <Link
                  href={`/services/${study.serviceSlug}/`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-10 py-5 text-lg font-bold text-white transition-all hover:border-white hover:bg-white/10"
                >
                  Our {study.service} Service
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </article>
    </main>
  );
}
