'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { CaseStudy } from '@/lib/case-studies-data';
import Reveal from './reveal';

/**
 * Case studies as a two-up card grid. Each card carries its own accentColor on
 * the metric chip, which is the only place non-brand colour appears on the page.
 * With five studies the last card is deliberately left to sit alone rather than
 * stretched full-width — a ragged last row reads as an index, not a mistake.
 */
export default function CaseCards({ studies }: { studies: CaseStudy[] }) {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between border-b border-[#0F0F0F] pb-4">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.35em] text-gray-400">
            Selected work
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-gray-400">
            {String(studies.length).padStart(2, '0')} projects
          </span>
        </div>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
          {studies.map((study, i) => (
            <Reveal key={study.slug} delay={(i % 2) * 0.08}>
              <Link
                href={`/case-studies/${study.slug}/`}
                className="group block overflow-hidden rounded-2xl border border-gray-200 bg-[#F4F4F5] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,15,15,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C72C5B] focus-visible:ring-offset-2"
              >
                {/* Square: the brand mockups are 1:1 collages, so a wider frame
                    would crop items out of the composition. */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={study.image || '/images/nopeca-mockup.png'}
                    alt={`${study.client} project by WeTrends`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: study.accentColor }}
                  >
                    {study.industry}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 bg-white p-5 md:p-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gray-400">
                        {study.number}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-[#0F0F0F] md:text-2xl">
                        {study.client}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
                      {study.tagline}
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span
                        className="text-xl font-bold"
                        style={{ color: study.accentColor }}
                      >
                        {study.metric}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gray-400">
                        {study.metricLabel}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#0F0F0F]" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
