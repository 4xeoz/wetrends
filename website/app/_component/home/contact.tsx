'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Linkedin, Instagram, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import ContactForm from './contact-form';
import Link from 'next/link';

const socialLinks = [
  {
    icon: Instagram,
    href: 'https://www.instagram.com/wetrends.uk',
    label: 'Instagram',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/wetrends-uk',
    label: 'LinkedIn',
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#0F0F0F]"
    >
      {/* Top section — Massive headline */}
      <div className="px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-6 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" />
              Start a Project
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 80 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,11vw,10rem)] font-bold leading-[0.85] tracking-tight text-white"
          >
            Let&apos;s Build
            <br />
            Something{' '}
            <span className="font-serif italic text-[#C72C5B]">Uncopyable.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 h-px w-24 bg-white/20"
          />
        </div>
      </div>

      {/* Contact grid */}
      <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
            {/* Left — Contact details */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col justify-between gap-12 lg:col-span-7"
            >
              <div className="space-y-10">
                {/* Description */}
                <p className="max-w-lg text-xl leading-relaxed text-white/60 sm:text-2xl">
                  Drop us a note. One of our founders will reply within 24 hours
                  and show you how WeTrends can plug straight into your brand.
                </p>

                {/* Email */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
                    Email
                  </p>
                  <Link
                    href="mailto:wetrends.uk@gmail.com"
                    className="group inline-flex items-center gap-4 text-3xl font-bold text-white transition-colors hover:text-[#C72C5B] sm:text-4xl md:text-5xl"
                  >
                    wetrends.uk@gmail.com
                    <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-8 sm:w-8" />
                  </Link>
                </div>

                {/* Location */}
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
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
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
                    Follow
                  </p>
                  <div className="flex gap-6">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="group inline-flex items-center gap-2 text-lg font-bold text-white transition-colors hover:text-[#C72C5B]"
                      >
                        <social.icon className="h-5 w-5" />
                        {social.label}
                        <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Areas */}
              <div className="border-t border-white/10 pt-8">
                <p className="text-sm leading-relaxed text-white/40">
                  Guildford • Woking • Farnham • Dorking • Reigate •
                  Leatherhead • Cobham • Esher • Surrey • London • UK
                </p>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent sm:rounded-3xl" />
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:rounded-3xl sm:p-10">
                  <ContactForm />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row sm:px-10 lg:px-16">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} WeTrends. All rights reserved.
          </p>
          <Link
            href="/questions/"
            className="text-xs text-white/40 transition-colors hover:text-[#C72C5B]"
          >
            Questions & Answers
          </Link>
        </div>
      </div>
    </section>
  );
}
