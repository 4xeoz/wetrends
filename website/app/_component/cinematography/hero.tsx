'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Camera, Film, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CinematographyHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      {/* Cinematic background layers */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0a0a0a]" />
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Film strip accent lines */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#C72C5B] to-transparent opacity-60" />
      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[#C72C5B] to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C72C5B]/40 bg-[#C72C5B]/10 px-4 py-2 text-sm font-medium text-[#C72C5B] backdrop-blur-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#C72C5B]" />
          University of Surrey · Guildford
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-6 text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Your Graduation
          <br />
          <span className="bg-gradient-to-r from-[#C72C5B] to-[#ff6b9d] bg-clip-text text-transparent">
            Captured Forever
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-white/70 sm:text-xl"
        >
          Professional photography &amp; cinematography for Surrey University
          graduates. Cinematic edits, fast delivery — memories that last a
          lifetime.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-10 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: Camera, label: 'From £35' },
            { icon: Clock, label: '48h Delivery' },
            { icon: Film, label: 'Cinematic Video' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm"
            >
              <Icon className="h-4 w-4 text-[#C72C5B]" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a href="#book">
            <Button className="rounded-full bg-[#C72C5B] px-8 py-6 text-base font-semibold text-white shadow-lg shadow-[#C72C5B]/30 hover:bg-[#a8244d] hover:shadow-[#C72C5B]/50 transition-all duration-300">
              Book Your Shoot
            </Button>
          </a>
          <a href="#packages">
            <Button
              variant="outline"
              className="rounded-full border-white/20 bg-white/5 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/40"
            >
              View Packages
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-8 w-8 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
