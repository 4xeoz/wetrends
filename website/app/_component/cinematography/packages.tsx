'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Camera, Film, Clock, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const packages = [
  {
    id: 'PHOTOS_8',
    name: 'Essentials',
    tagline: 'Perfect for sharing with family',
    price: 35,
    icon: Camera,
    popular: false,
    color: 'from-zinc-800 to-zinc-900',
    borderColor: 'border-white/10',
    features: [
      '8 professionally edited photos',
      'Your choice of shots from the session',
      'High-resolution digital files',
      'Delivered within 48 hours',
      'Perfect for framing & sharing',
      'Guildford campus or outdoor settings',
    ],
    delivery: '48h',
  },
  {
    id: 'PHOTOS_10_VIDEO',
    name: 'Premium',
    tagline: 'Ideal for LinkedIn & social media',
    price: 45,
    icon: Film,
    popular: true,
    color: 'from-[#C72C5B]/20 to-[#0a0a0a]',
    borderColor: 'border-[#C72C5B]/40',
    features: [
      '10 professionally edited photos',
      'Your choice of shots from the session',
      'Short cinematic graduation video',
      'Optimised for LinkedIn & social media',
      'High-resolution digital files',
      'Delivered within 48 hours',
      'Perfect for CV, profiles & memories',
      'Guildford campus or outdoor settings',
    ],
    delivery: '48h',
  },
];

export default function CinematographyPackages() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="packages"
      ref={ref}
      className="bg-[#0a0a0a] py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Our Packages
          </p>
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Choose Your Package
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Transparent pricing, no hidden fees — just beautiful memories
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 ${pkg.color} ${pkg.borderColor}`}
              >
                {pkg.popular && (
                  <div className="absolute -right-8 top-6 rotate-45 bg-[#C72C5B] px-10 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                    pkg.popular ? 'bg-[#C72C5B]' : 'bg-white/10'
                  }`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* Name & price */}
                <div className="mb-2 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                    <p className="text-sm text-white/50">{pkg.tagline}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-white">
                      £{pkg.price}
                    </span>
                  </div>
                </div>

                {/* Delivery badge */}
                <div className="mb-6 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#C72C5B]" />
                  <span className="text-sm font-medium text-white/60">
                    {pkg.delivery} delivery guaranteed
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          pkg.popular ? 'text-[#C72C5B]' : 'text-white/40'
                        }`}
                      />
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a href="#book">
                  <Button
                    className={`w-full rounded-xl py-5 font-semibold transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-[#C72C5B] text-white shadow-lg shadow-[#C72C5B]/25 hover:bg-[#a8244d]'
                        : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    Book {pkg.name} – £{pkg.price}
                  </Button>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center text-sm text-white/30"
        >
          <Star className="mr-1 inline h-4 w-4 text-amber-400" />
          All packages include professional editing, colour grading, and digital delivery
        </motion.p>
      </div>
    </section>
  );
}
