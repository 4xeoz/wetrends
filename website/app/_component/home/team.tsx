'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Users, Award, Coffee } from 'lucide-react';

const values = [
  { icon: Users, label: 'Collaborative', desc: 'We work as one' },
  { icon: Award, label: 'Excellence', desc: 'No shortcuts' },
  { icon: Coffee, label: 'Passion', desc: 'Love what we do' },
];

export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
          >
            <div className="max-w-2xl">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B] mb-4"
              >
                <span className="w-8 h-px bg-[#C72C5B]" />
                The People
              </motion.span>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F0F0F] leading-[0.9]">
                Meet The
                <br />
                <span className="font-serif italic text-[#C72C5B]">Squad</span>
              </h2>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-500 max-w-md lg:text-right"
            >
              Eight creative minds, one shared vision: building brands that break the mold.
            </motion.p>
          </motion.div>
        </div>

        {/* Team Photo - Smaller */}
        <div className="relative mb-12 max-w-4xl mx-auto">
          {/* Frame corners */}
          <div className="absolute -top-3 -left-3 w-12 h-12 border-l-2 border-t-2 border-[#C72C5B]" />
          <div className="absolute -top-3 -right-3 w-12 h-12 border-r-2 border-t-2 border-[#C72C5B]" />
          <div className="absolute -bottom-3 -left-3 w-12 h-12 border-l-2 border-b-2 border-[#C72C5B]" />
          <div className="absolute -bottom-3 -right-3 w-12 h-12 border-r-2 border-b-2 border-[#C72C5B]" />

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-gray-100 shadow-lg"
          >
            <Image
              src="/images/team-photo.jpg"
              alt="The WeTrends Squad"
              fill
              className="object-cover object-center"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16 flex justify-center gap-8 md:gap-16"
        >
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[#C72C5B]">8</p>
            <p className="mt-1 text-sm text-gray-500">Team Members</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[#C72C5B]">50+</p>
            <p className="mt-1 text-sm text-gray-500">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[#C72C5B]">30+</p>
            <p className="mt-1 text-sm text-gray-500">Happy Clients</p>
          </div>
        </motion.div>

        {/* Values row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16 grid grid-cols-3 gap-4 md:gap-6"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              className="text-center rounded-2xl border border-gray-100 bg-gray-50 p-6 md:p-8"
            >
              <value.icon className="mx-auto mb-3 h-6 w-6 text-[#C72C5B] md:h-8 md:w-8" />
              <p className="text-base md:text-lg font-bold text-[#0F0F0F]">{value.label}</p>
              <p className="mt-1 text-xs md:text-sm text-gray-500">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-gray-200 bg-white p-8 md:flex-row md:p-10 shadow-sm"
        >
          <div>
            <h4 className="text-2xl font-bold text-[#0F0F0F] md:text-3xl">
              Want to join the crew?
            </h4>
            <p className="mt-2 text-gray-500">
              We&apos;re always on the lookout for talented creatives.
            </p>
          </div>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-[#0F0F0F] px-8 py-4 font-bold text-white transition-all hover:bg-[#C72C5B]"
          >
            Join the Squad
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
