'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, CalendarDays, Camera, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: CalendarDays,
    title: 'Pick Your Date & Package',
    description:
      'Select your graduation date and choose Essentials (£35 · 20 pics) or Premium (£45 · 50 pics + video). Multiple students can book the same date — we shoot all day long.',
  },
  {
    number: '02',
    icon: Camera,
    title: 'We Come to You',
    description:
      "Meet us on the University of Surrey campus or anywhere in Guildford. We work quickly so you can get back to celebrating with family and friends.",
  },
  {
    number: '03',
    icon: Download,
    title: 'Download in 48 Hours',
    description:
      "Your edited photos (and cinematic video if you chose Premium) land in your inbox within 48 hours, ready to share, print, or add to your LinkedIn.",
  },
];

export default function CinematographyHowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" />
              Simple Process
            </span>
            <h2 className="text-5xl font-bold leading-[0.9] text-[#0F0F0F] md:text-6xl lg:text-7xl xl:text-8xl">
              Ready in
              <br />
              <span className="font-serif italic text-[#C72C5B]">3 Easy Steps</span>
            </h2>
          </motion.div>
        </div>

        {/* Steps list — same pattern as Services section */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <div
                className="group relative cursor-default"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Top border */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gray-200" />

                {/* Background on hover */}
                <motion.div
                  className="absolute inset-0 bg-[#0F0F0F]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                />

                {/* Content */}
                <div className="relative py-6 md:py-8">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-8">
                      {/* Step number */}
                      <span
                        className={`min-w-[2rem] font-mono text-sm transition-colors duration-300 ${
                          hoveredIndex === index ? 'text-[#C72C5B]' : 'text-gray-400'
                        }`}
                      >
                        {step.number}
                      </span>

                      {/* Icon */}
                      <div
                        className={`hidden h-12 w-12 items-center justify-center rounded-full transition-all duration-300 md:flex ${
                          hoveredIndex === index
                            ? 'bg-[#C72C5B] text-white'
                            : 'bg-gray-100 text-[#0F0F0F]'
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-xl font-bold transition-colors duration-300 md:text-3xl lg:text-4xl ${
                          hoveredIndex === index ? 'text-white' : 'text-[#0F0F0F]'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Description on hover + arrow */}
                    <div className="flex items-center gap-4 md:gap-8">
                      <motion.p
                        className="hidden max-w-xs text-sm text-white/70 lg:block"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                          opacity: hoveredIndex === index ? 1 : 0,
                          x: hoveredIndex === index ? 0 : 20,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {step.description}
                      </motion.p>

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 md:h-12 md:w-12 ${
                          hoveredIndex === index
                            ? 'border-[#C72C5B] bg-[#C72C5B] text-white'
                            : 'border-gray-200 text-gray-400'
                        }`}
                      >
                        <ArrowRight
                          className={`h-4 w-4 transition-transform duration-300 md:h-5 md:w-5 ${
                            hoveredIndex === index ? 'translate-x-0.5' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom border for last item */}
                {index === steps.length - 1 && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA block matching Services section pattern */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-gray-200 bg-gray-50 p-8 sm:flex-row sm:items-center md:mt-20 md:p-10"
        >
          <div>
            <p className="text-xl font-bold text-[#0F0F0F] md:text-2xl">
              Ready to secure your spot?
            </p>
            <p className="mt-1 text-gray-500">
              Slots fill fast during graduation season — book yours below.
            </p>
          </div>
          <Link
            href="#book"
            className="group inline-flex flex-shrink-0 items-center gap-3 rounded-full bg-[#C72C5B] px-8 py-4 font-bold text-white transition-all hover:bg-[#0F0F0F]"
          >
            Book Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
