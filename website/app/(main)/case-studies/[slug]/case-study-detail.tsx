'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, MapPin, TrendingUp } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import type { CaseStudy } from '@/lib/case-studies-data';

export default function CaseStudyDetail({ study }: { study: CaseStudy }) {
  return (
    <main className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/#case-studies"
          className="inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-[#0F0F0F]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Case Studies
        </Link>
      </div>

      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 md:py-32"
        style={{ background: `linear-gradient(135deg, white 55%, #C72C5B10 100%)` }}
      >
        <div className="absolute right-0 top-0 h-full w-1 bg-[#C72C5B] opacity-60" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <div>
              <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#C72C5B] px-4 py-1.5 text-sm font-bold text-white">
                    {study.service}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {study.location}
                  </span>
                </div>
              </AnimatedContent>

              <AnimatedContent direction="vertical" distance={80} duration={1.2} delay={0.1} ease="power3.out">
                <div className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
                  {study.number} — {study.industry}
                </div>
                <h1 className="mb-6 text-5xl font-bold leading-none text-[#0F0F0F] md:text-6xl lg:text-7xl">
                  {study.client}
                </h1>
                <p className="mb-8 text-xl font-medium text-[#C72C5B]">
                  {study.tagline}
                </p>
              </AnimatedContent>

              <AnimatedContent direction="vertical" distance={60} duration={1.2} delay={0.2} ease="power3.out">
                <p className="max-w-xl text-lg leading-relaxed text-gray-600">
                  {study.description}
                </p>
              </AnimatedContent>
            </div>

            {/* Right — Key Metric */}
            <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.3} ease="power3.out">
              <div className="grid grid-cols-2 gap-4">
                {study.results.map((result) => (
                  <motion.div
                    key={result.label}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="text-3xl font-bold leading-none text-[#C72C5B] md:text-4xl">
                      {result.value}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">{result.label}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* The Challenge */}
      <section className="bg-[#0F0F0F] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
              <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
                The Challenge
              </span>
              <h2 className="text-4xl font-bold leading-none text-white md:text-5xl lg:text-6xl">
                The Problem
                <br />
                <span className="font-serif italic text-[#C72C5B]">We Solved</span>
              </h2>
            </AnimatedContent>
            <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.2} ease="power3.out">
              <p className="text-xl leading-relaxed text-white/80">
                {study.challenge}
              </p>
            </AnimatedContent>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
            className="mb-16 text-center"
          >
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
              How We Did It
            </span>
            <h2 className="text-4xl font-bold leading-none text-[#0F0F0F] md:text-5xl lg:text-6xl">
              Our
              <span className="ml-3 font-serif italic text-[#C72C5B]">Approach</span>
            </h2>
          </AnimatedContent>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {study.approach.map((step, index) => (
              <AnimatedContent
                key={step.step}
                direction="vertical"
                distance={60}
                duration={0.8}
                delay={0.1 * index}
                ease="power3.out"
              >
                <div className="h-full rounded-2xl border border-gray-200 bg-white p-8">
                  <div
                    className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ backgroundColor: index % 2 === 0 ? '#C72C5B' : '#0F0F0F' }}
                  >
                    {step.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-[#0F0F0F]">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-gray-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
              <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
                The Results
              </span>
              <h2 className="text-4xl font-bold leading-none text-[#0F0F0F] md:text-5xl lg:text-6xl">
                Numbers That
                <br />
                <span className="font-serif italic text-[#C72C5B]">Matter</span>
              </h2>
            </AnimatedContent>

            <div className="grid grid-cols-2 gap-4">
              {study.results.map((result, index) => (
                <AnimatedContent
                  key={result.label}
                  direction="vertical"
                  distance={40}
                  duration={0.8}
                  delay={0.1 * index}
                  ease="power3.out"
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-[#C72C5B]" />
                    </div>
                    <div className="text-4xl font-bold leading-none text-[#C72C5B] md:text-5xl">
                      {result.value}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">{result.label}</div>
                  </motion.div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C72C5B]/10">
              <span className="text-4xl font-serif text-[#C72C5B]">&ldquo;</span>
            </div>
            <blockquote className="mb-8 text-2xl font-medium leading-relaxed text-[#0F0F0F] md:text-3xl">
              {study.testimonial.quote}
            </blockquote>
            <div>
              <div className="font-bold text-[#0F0F0F]">{study.testimonial.author}</div>
              <div className="mt-1 text-sm text-[#C72C5B]">{study.testimonial.role}</div>
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C72C5B] py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <h2 className="mb-6 text-4xl font-bold leading-none text-white md:text-5xl lg:text-6xl">
              Want Results
              <br />
              <span className="font-serif italic">Like These?</span>
            </h2>
            <p className="mb-10 text-xl text-white/80">
              Let&apos;s talk about your project. Free consultation for Guildford & Surrey businesses.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-[#C72C5B] shadow-lg transition-all hover:bg-gray-100"
              >
                Start Your Project
                <ArrowUpRight className="h-5 w-5" />
              </motion.a>
              <Link
                href={`/services/${study.serviceSlug}/`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-10 py-5 text-lg font-bold text-white transition-all hover:border-white hover:bg-white/10"
              >
                Our {study.service} Service
              </Link>
            </div>
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
