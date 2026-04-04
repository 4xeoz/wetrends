'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDownRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const Hero = () => {
  return (
    <section className="relative -mt-[72px] flex h-[100svh] min-h-[600px] w-full flex-col overflow-hidden bg-[#C72C5B] pt-[72px]">
      {/* Large background circle */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6 lg:px-8"
      >
        <div className="flex items-center gap-2 text-xs text-white/80 sm:text-sm">
          <MapPin className="h-4 w-4" />
          <span>Guildford, Surrey • Serving UK Businesses</span>
        </div>
        <div className="hidden text-xs text-white/80 sm:block sm:text-sm">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Available for Projects
          </span>
        </div>
      </motion.div>

      {/* Main content - centered */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs font-medium text-white sm:text-sm">Creative Agency of the Year 2024</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            We build <span className="font-serif italic">brands</span>
            <br />
            that refuse to blend in.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:mt-6 md:text-lg"
          >
            Video production, brand identity, web design & social media for ambitious businesses in Guildford, Surrey and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4"
          >
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#C72C5B] shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl sm:px-7 sm:py-3.5 sm:text-base md:px-8"
            >
              Start Your Project
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C72C5B] text-white transition-transform group-hover:scale-110 group-hover:rotate-45 sm:h-8 sm:w-8">
                <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </Link>

            <Link
              href="/services/"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10 sm:px-6 sm:py-3.5 sm:text-base md:px-8"
            >
              Explore Services
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 flex justify-center pb-6"
      >
        <Link
          href="#subhero"
          className="flex flex-col items-center gap-1 text-white/60 transition-colors hover:text-white sm:gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest sm:text-xs">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 sm:h-10 sm:w-10"
          >
            <ArrowDownRight className="h-3.5 w-3.5 rotate-45 sm:h-4 sm:w-4" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
