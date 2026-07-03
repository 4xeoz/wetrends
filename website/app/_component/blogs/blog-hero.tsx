'use client';

import { motion } from 'motion/react';

export function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-[#0F0F0F] py-20 md:py-32">
      {/* Background decorations */}
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#C72C5B]/20 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

      {/* Noise texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#C72C5B]"
          >
            <span className="h-px w-8 bg-[#C72C5B]" />
            Insights & Inspiration
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 text-4xl font-bold leading-none text-white md:text-5xl lg:text-6xl xl:text-7xl"
          >
            Our
            <span className="ml-2 font-serif italic text-[#C72C5B]">Blog</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
          >
            Expert insights on digital marketing, video production, social media strategy,
            and creative branding from Guildford&apos;s leading agency.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
