'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Star, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function CinematographyHero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      {/* Subtle top-right blob matching homepage aesthetic */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#C72C5B]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── LEFT: Copy ── */}
          <div>
            {/* Section label matching homepage pattern */}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#C72C5B]"
            >
              <span className="h-px w-8 bg-[#C72C5B]" />
              University of Surrey · Guildford
            </motion.span>

            {/* Heading — same scale and style as homepage sections */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl font-bold leading-[0.9] text-[#0F0F0F] sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Graduation
              <br />
              <span className="font-serif italic text-[#C72C5B]">Photos Forever</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-gray-600"
            >
              Professional photography &amp; cinematic video for{' '}
              <strong className="font-semibold text-[#0F0F0F]">Surrey University graduates</strong>.
              Stunning edits delivered to your inbox in 48 hours.
            </motion.p>

            {/* Star rating */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-5 flex items-center gap-2"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#0F0F0F]">5.0</span>
              <span className="text-sm text-gray-500">· 200+ Surrey graduates</span>
            </motion.div>

            {/* Price anchors */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <div className="flex items-baseline gap-1.5 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
                <span className="text-2xl font-bold text-[#0F0F0F]">£35</span>
                <span className="text-sm text-gray-500">· 40+ pictures · 3 spots</span>
              </div>
              <div className="flex items-baseline gap-1.5 rounded-2xl border border-[#C72C5B]/30 bg-[#C72C5B]/5 px-5 py-3">
                <span className="text-2xl font-bold text-[#C72C5B]">£45</span>
                <span className="text-sm text-gray-600">· 100+ pictures + video</span>
              </div>
            </motion.div>

            {/* CTA buttons — matching homepage rounded-full style */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="#book"
                className="group inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#C72C5B]/20 transition-all hover:bg-[#0F0F0F]"
              >
                Book Your Shoot
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3.5 text-sm font-bold text-[#0F0F0F] transition-all hover:border-[#0F0F0F] hover:bg-gray-50"
              >
                See Our Work
              </Link>
            </motion.div>

            {/* Trust micro-copy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {[
                { icon: Clock, text: '48h guaranteed delivery' },
                { icon: ShieldCheck, text: 'Satisfaction guarantee' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon className="h-3.5 w-3.5 text-[#C72C5B]" />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main portrait */}
            <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-3xl shadow-2xl shadow-gray-200 lg:max-w-none">
              <Image
                src="https://images.unsplash.com/photo-1627556704302-624286467c65?w=900&q=85"
                alt="Graduation portrait at University of Surrey, Guildford"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover object-top"
              />
            </div>

            {/* Floating: delivery badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F0F0F]">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-black text-[#0F0F0F]">48h Delivery</p>
                <p className="text-[10px] text-gray-500">Guaranteed</p>
              </div>
            </motion.div>

            {/* Floating: price badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -right-4 top-8 rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-xl"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Starting from
              </p>
              <p className="text-2xl font-black text-[#C72C5B]">£35</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
