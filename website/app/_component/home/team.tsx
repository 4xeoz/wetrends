'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative overflow-hidden bg-[#C72C5B]"
    >
      {/* Large background numbers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute -top-20 -left-10 text-[20rem] md:text-[30rem] font-black text-white/5 leading-none">
          08
        </span>
        <span className="absolute -bottom-40 -right-20 text-[15rem] md:text-[25rem] font-black text-white/5 leading-none">
          TM
        </span>
      </div>

      {/* Top section with image and title */}
      <div className="relative grid lg:grid-cols-2 min-h-[80vh]">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={isInView ? { opacity: 1, clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[50vh] lg:h-auto"
        >
          <Image
            src="/images/team-photo.jpg"
            alt="The WeTrends Squad"
            fill
            className="object-cover object-center grayscale contrast-125"
            sizes="50vw"
            priority
          />
         
        </motion.div>

        {/* Right: Content */}
        <div className="relative flex flex-col justify-center p-8 lg:p-16">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-white text-[#C72C5B] text-xs font-bold uppercase tracking-widest">
              The Collective
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              meet
              the
              <br />
              <span className="font-serif italic font-thin" style={{ WebkitTextStroke: '2px white' }}>
                Squad
              </span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-white/80 max-w-md mb-10"
          >
            Eight creative minds united by one mission: building brands that refuse to blend in.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex gap-10"
          >
            <div>
              <p className="text-5xl md:text-6xl font-black text-white">12</p>
              <p className="text-sm text-white/60 uppercase tracking-wider">Creatives</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-black text-white">50+</p>
              <p className="text-sm text-white/60 uppercase tracking-wider">Projects</p>
            </div>
            <div>
              <p className="text-5xl md:text-6xl font-black text-white">30+</p>
              <p className="text-sm text-white/60 uppercase tracking-wider">Clients</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom section with CTA */}
      <div className="relative bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="text-center md:text-left">
              <p className="text-3xl md:text-4xl font-bold text-[#0F0F0F]">
                Want to <span className="text-[#C72C5B]">join</span> the crew?
              </p>
              <p className="mt-2 text-gray-500">
                We&apos;re always scouting for fearless creatives.
              </p>
            </div>

            <Link
              href="/#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[#C72C5B] px-10 py-5 text-lg font-bold text-white transition-all hover:bg-[#0F0F0F] hover:scale-105"
            >
              Join the Squad
              <ArrowUpRight className="h-6 w-6 transition-transform group-hover:rotate-45" />
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
