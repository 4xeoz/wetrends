'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Video,
  Palette,
  Globe,
  Users,
  Zap,
  PenTool,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import Link from 'next/link';

const services = [
  {
    number: '01',
    icon: Video,
    title: 'Video Production',
    description: 'Cinematic storytelling for every platform.',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Brand Identity',
    description: 'Visual systems that demand attention.',
  },
  {
    number: '03',
    icon: Globe,
    title: 'Web Design',
    description: 'High-converting digital experiences.',
  },
  {
    number: '04',
    icon: Users,
    title: 'Social Media',
    description: 'Content that builds communities.',
  },
  {
    number: '05',
    icon: Zap,
    title: 'Animation',
    description: 'Motion that brings brands to life.',
  },
  {
    number: '06',
    icon: PenTool,
    title: 'Content Strategy',
    description: 'Stories that position you as the expert.',
  },
];

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative overflow-hidden bg-white py-20 md:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <motion.div style={{ y: headerY }}>
            <AnimatedContent direction="vertical" distance={40} duration={0.8} ease="power3.out">
              <span className="mb-4 inline-block text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
                What We Do
              </span>
            </AnimatedContent>

            <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.1} ease="power3.out">
              <h2 className="text-4xl font-bold leading-none text-[#0F0F0F] md:text-5xl lg:text-6xl xl:text-7xl">
                Services That
                <br />
                <span className="font-serif italic text-[#C72C5B]">Drive Growth</span>
              </h2>
            </AnimatedContent>
          </motion.div>
        </div>

        {/* Compact Services Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <AnimatedContent
              key={service.title}
              direction="vertical"
              distance={30}
              duration={0.6}
              delay={0.08 * (index % 3)}
              ease="power3.out"
            >
              <Link href={`/services/${service.title.toLowerCase().replace(' ', '-')}/`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:border-[#C72C5B] hover:bg-white hover:shadow-lg"
                >
                  {/* Watermark number */}
                  <span className="absolute -right-2 -top-4 text-6xl font-bold text-gray-200 transition-colors duration-300 group-hover:text-[#C72C5B]/20 md:text-7xl">
                    {service.number}
                  </span>

                  {/* Icon */}
                  <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C72C5B]/10 transition-colors duration-300 group-hover:bg-[#C72C5B]">
                    <service.icon className="h-6 w-6 text-[#C72C5B] transition-colors duration-300 group-hover:text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-lg font-bold text-[#0F0F0F] md:text-xl">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {service.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-6 right-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-300 group-hover:border-[#C72C5B] group-hover:bg-[#C72C5B] group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C72C5B] transition-all duration-500 group-hover:w-full" />
                </motion.div>
              </Link>
            </AnimatedContent>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatedContent
          direction="vertical"
          distance={40}
          duration={0.8}
          delay={0.2}
          ease="power3.out"
          className="mt-12 text-center md:mt-16"
        >
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-7 py-3.5 font-bold text-white transition-all hover:bg-[#A3244A] md:px-8 md:text-base"
          >
            Start Your Project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
        </AnimatedContent>
      </div>
    </section>
  );
}
