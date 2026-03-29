'use client';

import { motion } from 'motion/react';

export function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-20 md:py-32">
      {/* Background decorations */}
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#C72C5B]/20 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      
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
            className="mb-4 inline-block rounded-full bg-[#C72C5B]/10 px-4 py-1.5 text-sm font-medium text-[#C72C5B]"
          >
            Insights & Inspiration
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          >
            Our
            <span className="ml-2 font-serif italic text-[#C72C5B]">Blog</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto max-w-2xl text-lg text-gray-400"
          >
            Expert insights on digital marketing, video production, social media strategy, 
            and creative branding from Guildford&apos;s leading agency.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
