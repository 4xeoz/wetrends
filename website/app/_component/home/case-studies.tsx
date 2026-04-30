'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const works = [
  {
    id: '01',
    client: 'Nopeca',
    service: 'Web Design',
    year: '2024',
    metric: '+180%',
    metricLabel: 'Enquiries',
    description:
      'A website that gives parents confidence before they even step through the door.',
    href: '/case-studies/nopeca/',
    image: '/images/nopeca-mockup.webp',
    color: '#C72C5B',
  },
  {
    id: '02',
    client: 'Savana Lounge',
    service: 'Brand Identity',
    year: '2024',
    metric: '+320%',
    metricLabel: 'Direct bookings',
    description:
      'A brand that makes people choose Savana before they even check the menu.',
    href: '/case-studies/savana-lounge/',
    image: '/images/savana-mockup.png',
    color: '#0F0F0F',
  },
];

function WorkCard({
  work,
  index,
  isActive,
  onActivate,
}: {
  work: (typeof works)[0];
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: '-40% 0px -40% 0px' });

  useEffect(() => {
    if (isInView) {
      onActivate();
    }
  }, [isInView, onActivate]);

  return (
    <div
      ref={cardRef}
      className="min-h-[70vh] flex items-center py-12 md:py-0"
    >
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className={`w-full rounded-3xl border p-8 transition-all duration-500 sm:p-10 md:p-12 ${
          isActive
            ? 'border-[#C72C5B]/20 bg-gray-50'
            : 'border-transparent bg-transparent hover:bg-gray-50/50'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-mono transition-colors ${
                isActive ? 'text-[#C72C5B]' : 'text-gray-300'
              }`}
            >
              {work.id}
            </span>
            <div>
              <h4
                className={`text-2xl font-bold transition-colors sm:text-3xl ${
                  isActive ? 'text-[#0F0F0F]' : 'text-gray-400'
                }`}
              >
                {work.client}
              </h4>
              <p className="text-sm text-gray-400">{work.service}</p>
            </div>
          </div>

          <div
            className={`text-right transition-all ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="block text-4xl font-bold text-[#C72C5B] sm:text-5xl">
              {work.metric}
            </span>
            <span className="text-xs text-gray-400">{work.metricLabel}</span>
          </div>
        </div>

        <p className="mt-6 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
          {work.description}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#0F0F0F] border border-gray-100">
            {work.service}
          </span>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs text-gray-500 border border-gray-100">
            {work.year}
          </span>
        </div>

        <div className="mt-8 h-0.5 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full bg-[#C72C5B]"
            initial={{ width: '0%' }}
            animate={{ width: isActive ? '100%' : '0%' }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <Link
          href={work.href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#0F0F0F] transition-colors hover:text-[#C72C5B] group"
        >
          View Case Study
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </div>
  );
}

export function CaseStudies() {
  const [activeIndex, setActiveIndex] = useState(0);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, {
    once: true,
    margin: '-100px',
  });

  return (
    <section id="work" className="relative bg-white">
      {/* Header */}
      <div
        ref={headerRef}
        className="px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 xl:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]"
              >
                <span className="h-px w-8 bg-[#C72C5B]" />
                Selected Work
              </motion.span>
              <h2 className="text-5xl font-bold leading-[0.9] text-[#0F0F0F] md:text-6xl lg:text-7xl xl:text-8xl">
                Our
                <br />
                <span className="font-serif italic text-[#C72C5B]">Work</span>
              </h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-md text-lg text-gray-500 lg:text-right"
            >
              Real results for ambitious brands. Each project tells a story of
              transformation.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Sticky Scroll Showcase */}
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left: Sticky Image */}
            <div className="hidden lg:block">
              <div className="sticky top-24 h-[calc(100vh-12rem)]">
                <div className="relative h-full w-full overflow-hidden rounded-3xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: works[activeIndex].color }}
                      >
                        <Image
                          src={works[activeIndex].image}
                          alt={`${works[activeIndex].client} ${works[activeIndex].service.toLowerCase()} mockup by WeTrends, a creative agency in Guildford, Surrey`}
                          fill
                          className="object-cover"
                          sizes="50vw"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Bottom Info */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h3 className="text-3xl font-bold text-white md:text-4xl">
                          {works[activeIndex].client}
                        </h3>
                        <p className="mt-1 text-sm text-white/80">
                          {works[activeIndex].description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute left-6 top-6 flex items-center gap-3">
                    <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#0F0F0F]">
                      {works[activeIndex].service}
                    </span>
                    <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                      {works[activeIndex].year}
                    </span>
                  </div>

                  {/* View Link */}
                  <Link
                    href={works[activeIndex].href}
                    className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0F0F0F] transition-transform hover:scale-110"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Images */}
            <div className="space-y-6 lg:hidden">
              {works.map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative aspect-[4/3] overflow-hidden rounded-3xl"
                >
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: work.color }}
                  >
                    <Image
                      src={work.image}
                      alt={`${work.client} ${work.service.toLowerCase()} mockup by WeTrends, a creative agency in Guildford, Surrey`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0F0F0F]">
                      {work.service}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">
                      {work.client}
                    </h3>
                    <p className="text-sm text-white/80">{work.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Scrolling Work Cards */}
            <div className="flex flex-col">
              {works.map((work, index) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  index={index}
                  isActive={activeIndex === index}
                  onActivate={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Marquee */}
      <div className="overflow-hidden border-t border-gray-100 py-12">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: 'linear',
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mx-8 flex items-center gap-8">
              <span className="text-6xl font-bold text-black md:text-8xl">
                WORK
              </span>
              <span className="h-4 w-4 rounded-full bg-[#C72C5B]" />
              <span className="font-serif text-6xl italic text-black md:text-8xl">
                Speaks
              </span>
              <span className="h-4 w-4 rounded-full bg-black" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="px-4 pb-24 pt-12 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/services/"
            className="group inline-flex items-center gap-3 rounded-full bg-[#0F0F0F] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#C72C5B]"
          >
            Explore All Services
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
