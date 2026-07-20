'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'motion/react';
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
  const isInView = useInView(heroRef, { once: true, margin: '-100px' });

  return (
    <main className="bg-white">
      <ScrollProgress color={accent} />

      <article>
        {/* ── Hero — same split-screen structure as the home Team section ── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{ backgroundColor: accent }}
        >
          {/* Large background number */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute -top-20 -left-10 text-[20rem] font-black leading-none text-white/5 md:text-[30rem]">
              {study.number}
            </span>
          </div>

          <div className="relative grid min-h-screen lg:grid-cols-2">
            {/* Left: Content */}
            <div className="order-2 flex flex-col justify-center p-8 lg:order-1 lg:p-16">
              {/* Back link */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
              >
                <Link
                  href="/case-studies/"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  All Case Studies
                </Link>
              </motion.div>

              {/* Label */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <span className="inline-block bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                  {study.industry}
                </span>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-6"
              >
                <h1 className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                  {study.client}
                </h1>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-10 max-w-md text-lg text-white/80 md:text-xl"
              >
                {study.tagline}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-10"
              >
                <div>
                  <p className="text-4xl font-black text-white md:text-5xl lg:text-6xl">
                    {study.metric}
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-wider text-white/60">
                    {study.metricLabel}
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-black text-white md:text-5xl lg:text-6xl">
                    {study.year}
                  </p>
                  <p className="mt-1 text-sm uppercase tracking-wider text-white/60">
                    Year
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
              animate={isInView ? { opacity: 1, clipPath: 'inset(0 0 0 0%)' } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative order-1 h-[50vh] lg:order-2 lg:h-auto"
            >
              {study.image ? (
                <Image
                  src={study.image}
                  alt={`${study.client} project by WeTrends`}
                  fill
                  className="object-cover object-center"
                  sizes="50vw"
                  priority
                />
              ) : (
                <CasePoster
                  image={study.image}
                  client={study.client}
                  industry={study.industry}
                  accentColor={accent}
                  domain={study.domain}
                  priority
                />
              )}
            </motion.div>
          </div>
        </section>

        {/* ── Challenge — split-screen, sticky title ───────── */}
        <section className="relative bg-white">
          <div className="grid lg:grid-cols-2">
            {/* Sticky left */}
            <div className="relative flex flex-col justify-center bg-[#0B0B0C] p-8 sm:p-12 lg:sticky lg:top-0 lg:h-screen lg:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 top-1/4 h-[24rem] w-[24rem] rounded-full opacity-25 blur-[120px]"
                style={{ backgroundColor: accent }}
              />
              <div className="relative">
                <Reveal>
                  <span
                    className="font-mono text-xs uppercase tracking-[0.25em]"
                    style={{ color: accent }}
                  >
                    The Challenge
                  </span>
                  <h2 className="mt-4 text-3xl font-bold leading-[0.95] text-white sm:text-4xl md:text-5xl">
                    The problem
                  </h2>
                </Reveal>
              </div>
            </div>

            {/* Scrolling right */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <Reveal>
                <p className="text-xl leading-relaxed text-[#0F0F0F] md:text-2xl lg:text-3xl">
                  {study.challenge}
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5 border-t border-gray-200 pt-8 font-mono text-xs uppercase tracking-[0.15em]">
                  {[
                    ['Service', study.service],
                    ['Location', study.location],
                    ['Year', study.year],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-gray-400">{label}</dt>
                      <dd className="mt-1 text-sm font-semibold normal-case tracking-normal text-[#0F0F0F]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Solution — split-screen, sticky title ────────── */}
        <section className="relative bg-gray-50">
          <div className="grid lg:grid-cols-2">
            {/* Sticky left */}
            <div className="relative flex flex-col justify-center bg-[#0B0B0C] p-8 sm:p-12 lg:sticky lg:top-0 lg:h-screen lg:p-16">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 top-1/3 h-[24rem] w-[24rem] rounded-full opacity-25 blur-[120px]"
                style={{ backgroundColor: accent }}
              />
              <div className="relative">
                <Reveal>
                  <span
                    className="font-mono text-xs uppercase tracking-[0.25em]"
                    style={{ color: accent }}
                  >
                    How we solved it
                  </span>
                  <h2 className="mt-4 text-3xl font-bold leading-[0.95] text-white sm:text-4xl md:text-5xl">
                    The solution
                  </h2>
                </Reveal>
              </div>
            </div>

            {/* Scrolling right */}
            <div className="p-8 sm:p-12 lg:p-16">
              <div className="space-y-0">
                {study.approach.map((step, i) => (
                  <Reveal key={step.step} delay={i * 0.05}>
                    <div className="group border-t border-gray-200 py-10 first:border-t-0">
                      <div className="flex items-baseline gap-4">
                        <span
                          className="text-3xl font-bold leading-none md:text-4xl"
                          style={{ color: accent }}
                        >
                          {step.step}
                        </span>
                        <h3 className="text-xl font-bold text-[#0F0F0F] md:text-2xl">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">
                        {step.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Results — full-bleed dark band ───────────────── */}
        <section className="relative overflow-hidden bg-[#0B0B0C] py-20 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <span
                className="font-mono text-xs uppercase tracking-[0.25em]"
                style={{ color: accent }}
              >
                The Results
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-[0.95] text-white sm:text-4xl md:text-5xl">
                Numbers that moved
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {study.results.map((result, i) => (
                <Reveal
                  key={result.label}
                  delay={i * 0.08}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
                >
                  <CountUp
                    value={result.value}
                    className="block text-3xl font-bold leading-none tracking-tight text-white md:text-4xl"
                  />
                  <div className="mt-3 text-sm font-medium text-white/50">
                    {result.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonial ───────────────────────────────────── */}
        {study.testimonial && (
          <section className="bg-white py-20 md:py-28">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
              <Reveal>
                <div
                  className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white"
                  style={{ backgroundColor: accent }}
                >
                  &ldquo;
                </div>
                <blockquote className="text-xl font-medium leading-relaxed text-[#0F0F0F] md:text-2xl">
                  {study.testimonial.quote}
                </blockquote>
                <div className="mt-6">
                  <div className="font-bold text-[#0F0F0F]">
                    {study.testimonial.author}
                  </div>
                  <div className="text-sm" style={{ color: accent }}>
                    {study.testimonial.role}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ── Next case ─────────────────────────────────────── */}
        <Link
          href={`/case-studies/${next.slug}/`}
          className="group relative block overflow-hidden bg-[#0B0B0C] py-16 md:py-24"
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
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
                Next case — {next.number}
              </span>
              <h2 className="mt-3 text-3xl font-bold leading-[0.95] text-white sm:text-4xl md:text-5xl">
                {next.client}
              </h2>
              <p className="mt-4 max-w-md italic text-white/60 md:text-lg">
                {next.tagline}
              </p>
              <span
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
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

        {/* ── CTA ───────────────────────────────────────────── */}
        <section
          className="py-20 md:py-28"
          style={{ backgroundColor: accent }}
        >
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-bold leading-[0.95] text-white sm:text-4xl md:text-5xl">
                Want results
                <span className="ml-2 font-serif italic font-normal">
                  like these?
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base text-white/80 md:text-lg">
                Let&apos;s talk about your project. Free consultation for
                Guildford &amp; Surrey businesses.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <motion.a
                  href="/#contact"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#0F0F0F] shadow-lg"
                >
                  Start Your Project
                  <ArrowUpRight className="h-5 w-5" />
                </motion.a>
                <Link
                  href={`/services/${study.serviceSlug}/`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-bold text-white transition-all hover:border-white hover:bg-white/10"
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
