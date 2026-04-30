'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { Linkedin, Instagram, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import ContactForm from './contact-form';
import Link from 'next/link';

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/wetrends.uk', label: 'Instagram' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/wetrends-uk', label: 'LinkedIn' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-[#0F0F0F]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/footer_background.webp"
          alt="Contact WeTrends creative agency in Guildford Surrey"
          fill
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-[#0F0F0F]/80 to-[#0F0F0F]" />
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Top Section — Big Text */}
        <div className="px-4 pt-20 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:pt-40 md:pb-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-4 inline-flex items-center gap-3 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                Start a Project
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 80 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tight text-white"
            >
              Let&apos;s Build
              <br />
              Something{' '}
              <span className="font-serif italic text-[#C72C5B]">Uncopyable.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/60 sm:mt-8 sm:text-xl"
            >
              Drop us a note. One of our founders will reply within 24 hours and show you how WeTrends can plug straight into your brand.
            </motion.p>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 py-10 sm:py-14 md:grid-cols-2 md:gap-16 md:py-20">
              {/* Left — Big Contact Details */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col justify-between gap-10"
              >
                <div className="space-y-8">
                  {/* Email */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                      Email Us
                    </p>
                    <Link
                      href="mailto:wetrends.uk@gmail.com"
                      className="group inline-flex items-center gap-3 text-[clamp(1.5rem,4vw,3.5rem)] font-bold leading-none text-white transition-colors hover:text-[#C72C5B]"
                    >
                      wetrends.uk@gmail.com
                      <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-8 sm:w-8" />
                    </Link>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                      Find Us
                    </p>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#C72C5B]" />
                      <p className="text-xl font-bold text-white sm:text-2xl">
                        Guildford, Surrey, UK
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div>
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
                    Follow Along
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-105 hover:bg-[#C72C5B] hover:border-[#C72C5B]"
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right — Form */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="relative">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none sm:rounded-3xl" />
                  <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:rounded-3xl sm:p-8">
                    <ContactForm />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 sm:py-8 lg:px-8">
            <p className="text-center text-xs text-white/40 sm:text-left">
              Guildford • Woking • Farnham • Dorking • Reigate • Leatherhead • Cobham • Esher • Surrey • London • UK
            </p>
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} WeTrends. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
