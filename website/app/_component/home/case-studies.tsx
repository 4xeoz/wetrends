'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

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

function WorkItem({
  work,
  index,
  reversed,
}: {
  work: (typeof works)[0];
  index: number;
  reversed: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: '-100px' });

  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <div
      ref={itemRef}
      className="relative min-h-screen border-t border-gray-100"
    >
      {/* Background project number */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.04 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[30vh] font-bold leading-none tracking-tighter text-[#0F0F0F] sm:text-[40vh]"
      >
        {work.id}
      </motion.span>

      <div
        className={`relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-12 ${
          reversed ? '' : ''
        }`}
      >
        {/* Image */}
        <div
          ref={imageRef}
          className={`relative col-span-1 overflow-hidden lg:col-span-7 ${
            reversed ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div className="sticky top-0 h-screen w-full">
            <motion.div
              style={{ scale: imageScale, y: imageY }}
              className="absolute inset-0"
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
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </motion.div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Metric badge on image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`absolute bottom-8 flex items-center gap-4 ${
                reversed ? 'left-8 lg:left-auto lg:right-8' : 'left-8'
              }`}
            >
              <div className="rounded-2xl bg-white/95 px-6 py-4 backdrop-blur-sm">
                <span className="block text-3xl font-bold text-[#C72C5B] sm:text-4xl">
                  {work.metric}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  {work.metricLabel}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`relative col-span-1 flex items-center px-6 py-16 sm:px-10 lg:col-span-5 lg:px-16 lg:py-0 ${
            reversed ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full"
          >
            {/* Project number */}
            <span className="mb-4 block text-sm font-mono text-[#C72C5B]">
              Project {work.id}
            </span>

            {/* Client name */}
            <h3 className="text-4xl font-bold leading-[0.95] text-[#0F0F0F] sm:text-5xl md:text-6xl lg:text-7xl">
              {work.client}
            </h3>

            {/* Service tag */}
            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C72C5B]" />
              <span className="text-sm font-medium uppercase tracking-wider text-[#C72C5B]">
                {work.service}
              </span>
              <span className="text-sm text-gray-400">{work.year}</span>
            </div>

            {/* Description */}
            <p className="mt-8 max-w-sm text-lg leading-relaxed text-gray-600">
              {work.description}
            </p>

            {/* CTA */}
            <Link
              href={work.href}
              className="group mt-10 inline-flex items-center gap-3 text-base font-bold text-[#0F0F0F] transition-colors hover:text-[#C72C5B]"
            >
              <span className="relative">
                View Case Study
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-current transition-transform duration-300 group-hover:scale-x-0" />
              </span>
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function CaseStudies() {
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
        className="px-6 pb-16 pt-24 sm:px-10 sm:pb-20 sm:pt-32 lg:px-16 lg:pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-6 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" />
              Selected Work
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 60 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(4rem,12vw,10rem)] font-bold leading-[0.85] tracking-tight text-[#0F0F0F]"
          >
            Our
            <br />
            <span className="font-serif italic text-[#C72C5B]">Work</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-md text-lg leading-relaxed text-gray-500"
          >
            Real results for ambitious brands. Each project tells a story of
            transformation.
          </motion.p>
        </div>
      </div>

      {/* Projects */}
      {works.map((work, index) => (
        <WorkItem
          key={work.id}
          work={work}
          index={index}
          reversed={index % 2 !== 0}
        />
      ))}

      {/* Bottom CTA */}
      <div className="border-t border-gray-100 px-6 py-20 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"
        >
          <p className="text-2xl font-bold text-[#0F0F0F] sm:text-3xl">
            Want to see your brand here?
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-[#0F0F0F] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#C72C5B]"
          >
            Start Your Project
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
