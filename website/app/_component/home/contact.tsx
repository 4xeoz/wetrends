'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Linkedin, Instagram, MapPin, ArrowUpRight } from 'lucide-react';
import ContactForm from './contact-form';
import Link from 'next/link';

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} id="contact" className="relative bg-[#0F0F0F]">
      {/* Top — Massive headline */}
      <div className="px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#C72C5B]">
              Contact
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 80 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-tight text-white"
          >
            Ready when
            <br />
            you{' '}
            <span className="font-serif italic text-[#C72C5B]">are.</span>
          </motion.h2>
        </div>
      </div>

      {/* Email & Location */}
      <div className="px-6 pt-16 sm:px-10 sm:pt-20 lg:px-16 lg:pt-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid gap-10 sm:grid-cols-2 sm:gap-16 lg:grid-cols-3 lg:gap-20"
          >
            {/* Email */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                Email
              </p>
              <Link
                href="mailto:wetrends.uk@gmail.com"
                className="group inline-flex items-center gap-3 text-xl font-bold text-white transition-colors hover:text-[#C72C5B] sm:text-2xl"
              >
                wetrends.uk@gmail.com
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>

            {/* Location */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                Location
              </p>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#C72C5B]" />
                <p className="text-xl font-bold text-white sm:text-2xl">
                  Guildford, Surrey, UK
                </p>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                Social
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.instagram.com/wetrends.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-xl font-bold text-white transition-colors hover:text-[#C72C5B] sm:text-2xl"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/wetrends-uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-xl font-bold text-white transition-colors hover:text-[#C72C5B] sm:text-2xl"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="my-16 h-px origin-left bg-white/10 sm:my-20 lg:my-24"
        />
      </div>

      {/* Form */}
      <div className="px-6 pb-20 sm:px-10 sm:pb-24 lg:px-16 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Left — Form intro */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-4"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                Start a Project
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/60">
                Tell us what you are building. We will handle the rest. Most
                replies land within 24 hours.
              </p>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-8"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row sm:px-10 lg:px-16">
          <p className="text-center text-xs text-white/40 sm:text-left">
            Guildford • Woking • Farnham • Dorking • Reigate • Leatherhead •
            Cobham • Esher • Surrey • London • UK
          </p>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} WeTrends
          </p>
        </div>
      </div>
    </section>
  );
}
