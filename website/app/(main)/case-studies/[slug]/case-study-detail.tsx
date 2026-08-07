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
import Chapter from '../_components/chapter';

/**
 * A case study told as a story rather than presented as a spec sheet.
 *
 * The page runs as four numbered chapters — where they started, what was wrong,
 * what we did, where it landed — so a reader gets a beginning, a middle and an
 * end instead of a grid of facts. Chapters alternate light and dark to pace the
 * scroll, and each one opens with the same furniture (number, rule, eyebrow,
 * headline) so the rhythm is learned once and then simply followed.
 *
 * Everything after chapter four is optional and self-hides: the client quote
 * only appears where one has been approved, and the results chapter renames
 * itself when a study has no before/after figures to show.
 */
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

  /**
   * A launch study can legitimately have no before/after figures. When none of
   * the tiles carry a real measurement the chapter calls itself "What we
   * shipped" rather than "Where it landed", so the heading never promises data
   * the page cannot show.
   */
  const hasMetrics = study.results.some(
    (r) => r.baseline || r.window || r.source,
  );

  return (
    <main className="bg-white">
      <ScrollProgress color={accent} />

      <article>
        {/* ══ Opening scene ══════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{ backgroundColor: accent }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute -left-10 -top-20 text-[20rem] font-black leading-none text-white/5 md:text-[30rem]">
              {study.number}
            </span>
          </div>

          <div className="relative grid min-h-screen lg:grid-cols-2">
            <div className="order-2 flex flex-col justify-center p-8 lg:order-1 lg:p-16">
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

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-6"
              >
                <span
                  className="inline-block bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  {study.industry}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-6 text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              >
                {study.client}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-10 max-w-md text-lg text-white/80 md:text-xl"
              >
                {study.tagline}
              </motion.p>

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
                  priority
                />
              )}
            </motion.div>
          </div>
        </section>

        {/* ══ 01 · Where they started ════════════════════════ */}
        <section className="bg-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Chapter
              index="01"
              eyebrow="Where they started"
              title={
                <>
                  Before we
                  <span className="font-serif font-thin italic" style={{ color: accent }}>
                    {' '}got involved.
                  </span>
                </>
              }
              accent={accent}
            >
              <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
                <Reveal>
                  <p className="text-xl leading-relaxed text-[#0F0F0F] md:text-2xl">
                    {study.description}
                  </p>

                  {study.snapshot && study.snapshot.length > 0 && (
                    <ul className="mt-10 space-y-3">
                      {study.snapshot.map((fact) => (
                        <li
                          key={fact}
                          className="flex gap-4 text-base leading-relaxed text-gray-600 md:text-lg"
                        >
                          <span
                            aria-hidden
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: accent }}
                          />
                          {fact}
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>

                <Reveal delay={0.1}>
                  <dl className="divide-y divide-gray-200 border-y border-gray-200">
                    {[
                      { term: 'Client', value: study.client },
                      { term: 'Industry', value: study.industry },
                      { term: 'Service', value: study.service },
                      { term: 'Location', value: study.location },
                      { term: 'Year', value: study.year },
                    ].map((row) => (
                      <div
                        key={row.term}
                        className="flex items-baseline justify-between gap-6 py-3.5"
                      >
                        <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
                          {row.term}
                        </dt>
                        <dd className="text-right text-sm font-medium text-[#0F0F0F]">
                          {row.value}
                        </dd>
                      </div>
                    ))}

                  </dl>

                  <div className="mt-8">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
                      What we delivered
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {study.deliverables.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border px-3.5 py-1.5 text-sm font-medium"
                          style={{ borderColor: `${accent}40`, color: accent }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            </Chapter>
          </div>
        </section>

        {/* ══ 02 · The problem ═══════════════════════════════
            Dark, and the challenge is set at display size rather than body
            size — this is the turn the rest of the story hangs on, so it gets
            the page to itself. */}
        <section className="relative overflow-hidden bg-[#0B0B0C] py-24 md:py-32">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 top-1/4 h-[32rem] w-[32rem] rounded-full opacity-20 blur-[140px]"
            style={{ backgroundColor: accent }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Chapter
              index="02"
              eyebrow="The problem"
              title={
                <>
                  What stood
                  <span className="font-serif font-thin italic" style={{ color: accent }}>
                    {' '}in the way.
                  </span>
                </>
              }
              accent={accent}
              tone="dark"
            >
              <Reveal delay={0.05}>
                <p className="mt-14 max-w-4xl text-xl leading-relaxed text-white/80 sm:text-2xl md:text-3xl md:leading-[1.4]">
                  {study.challenge}
                </p>
              </Reveal>
            </Chapter>
          </div>
        </section>

        {/* ══ 03 · What we did ═══════════════════════════════
            The approach steps are the middle of the story, so they run as a
            connected sequence on a spine rather than as four detached cards. */}
        <section className="bg-[#F4F4F5] py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Chapter
              index="03"
              eyebrow="What we did"
              title={
                <>
                  How we
                  <span className="font-serif font-thin italic" style={{ color: accent }}>
                    {' '}built it.
                  </span>
                </>
              }
              accent={accent}
            >
              <ol className="mt-16 space-y-0">
                {study.approach.map((step, i) => (
                  <Reveal key={step.step} delay={i * 0.06}>
                    <li className="relative grid gap-4 pb-12 pl-14 md:grid-cols-[1fr_1.6fr] md:gap-12 md:pb-16 md:pl-20">
                      {/* Spine + node, so the four beats read as one sequence */}
                      <span
                        aria-hidden
                        className="absolute left-[13px] top-2 h-full w-px md:left-[19px]"
                        style={{ backgroundColor: `${accent}30` }}
                      />
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full font-mono text-[10px] font-bold text-white md:h-10 md:w-10 md:text-xs"
                        style={{ backgroundColor: accent }}
                      >
                        {step.step}
                      </span>

                      <h3 className="text-2xl font-bold leading-tight tracking-tight text-[#0F0F0F] md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="text-base leading-relaxed text-gray-600 md:text-lg">
                        {step.description}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </Chapter>
          </div>
        </section>

        {/* ══ 04 · Where it landed ═══════════════════════════ */}
        <section className="relative overflow-hidden bg-[#0B0B0C] py-24 md:py-32">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Chapter
              index="04"
              eyebrow={hasMetrics ? 'Where it landed' : 'What we shipped'}
              title={
                <>
                  How it
                  <span className="font-serif font-thin italic" style={{ color: accent }}>
                    {' '}turned out.
                  </span>
                </>
              }
              accent={accent}
              tone="dark"
            >
              <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {study.results.map((result, i) => (
                  <Reveal
                    key={result.label}
                    delay={i * 0.08}
                    className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
                  >
                    <CountUp
                      value={result.value}
                      className="block text-3xl font-bold leading-none tracking-tight text-white md:text-4xl"
                    />
                    <div className="mt-3 text-sm font-medium text-white/50">
                      {result.label}
                    </div>

                    {/* Baseline / window / source — what makes a figure
                        checkable rather than merely impressive. */}
                    {(result.baseline || result.window || result.source) && (
                      <dl className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-xs leading-relaxed">
                        {result.baseline && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 text-white/35">From</dt>
                            <dd className="text-white/70">{result.baseline}</dd>
                          </div>
                        )}
                        {result.window && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 text-white/35">Over</dt>
                            <dd className="text-white/70">{result.window}</dd>
                          </div>
                        )}
                        {result.source && (
                          <div className="flex gap-2">
                            <dt className="shrink-0 text-white/35">Source</dt>
                            <dd className="text-white/70">{result.source}</dd>
                          </div>
                        )}
                      </dl>
                    )}
                  </Reveal>
                ))}
              </div>

              {study.attribution && (
                <Reveal delay={0.1}>
                  <p className="mt-10 max-w-2xl border-l-2 border-white/20 pl-5 text-sm leading-relaxed text-white/45">
                    {study.attribution}
                  </p>
                </Reveal>
              )}
            </Chapter>
          </div>
        </section>

        {/* ══ In their words — only where a quote is approved ══ */}
        {study.testimonial && (
          <section className="bg-white py-24 md:py-32">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-400"
                >
                  In their words
                </span>
                <blockquote className="mt-8 text-[clamp(1.6rem,3.4vw,2.75rem)] font-medium leading-[1.2] tracking-tight text-[#0F0F0F]">
                  <span className="font-serif italic" style={{ color: accent }}>
                    &ldquo;
                  </span>
                  {study.testimonial.quote}
                  <span className="font-serif italic" style={{ color: accent }}>
                    &rdquo;
                  </span>
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span
                    aria-hidden
                    className="h-px w-10 shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                  <span>
                    <span className="block font-bold text-[#0F0F0F]">
                      {study.testimonial.author}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {study.testimonial.role}
                    </span>
                  </span>
                </figcaption>
              </Reveal>
            </div>
          </section>
        )}

        {/* ══ Next chapter ═══════════════════════════════════ */}
        <section className="border-t border-gray-200 bg-white">
          <Link
            href={`/case-studies/${next.slug}/`}
            className="group block px-4 py-16 transition-colors hover:bg-[#F4F4F5] sm:px-6 md:py-20 lg:px-8"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-400">
                  Next story
                </span>
                <p className="mt-3 text-3xl font-bold tracking-tight text-[#0F0F0F] md:text-4xl lg:text-5xl">
                  {next.client}
                </p>
                <p className="mt-2 max-w-xl text-base text-gray-500 md:text-lg">
                  {next.tagline}
                </p>
              </div>
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1 md:h-16 md:w-16"
                style={{ backgroundColor: next.accentColor }}
              >
                <ArrowRight className="h-6 w-6" />
              </span>
            </div>
          </Link>
        </section>

        {/* ══ CTA ════════════════════════════════════════════ */}
        <section className="py-20 md:py-28" style={{ backgroundColor: accent }}>
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-bold leading-[0.95] text-white sm:text-4xl md:text-5xl">
                Want results
                <span className="ml-2 font-serif font-normal italic">
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
