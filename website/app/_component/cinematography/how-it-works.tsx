'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { CalendarDays, Camera, Download } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: CalendarDays,
    title: 'Book Your Date',
    description:
      'Select your graduation date and choose a package. Multiple students can book the same date — we shoot all day.',
  },
  {
    step: '02',
    icon: Camera,
    title: 'Your Shoot',
    description:
      'Meet us on campus or at an agreed Guildford location. We capture your best moments naturally and professionally.',
  },
  {
    step: '03',
    icon: Download,
    title: 'Receive in 48h',
    description:
      "Within 48 hours you'll receive your edited photos (and cinematic video if Premium) straight to your inbox.",
  },
];

export default function CinematographyHowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="bg-[#0a0a0a] py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Simple Process
          </p>
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Three easy steps from booking to beautiful memories
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute left-1/2 top-10 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C72C5B]/30 to-transparent md:block" />

          {steps.map(({ step, icon: Icon, title, description }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number circle */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#C72C5B]/30 bg-[#C72C5B]/10">
                <Icon className="h-8 w-8 text-[#C72C5B]" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#C72C5B] text-xs font-black text-white">
                  {i + 1}
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
