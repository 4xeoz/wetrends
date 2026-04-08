'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Linkedin, Instagram, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import ContactForm from './contact-form';
import Link from 'next/link';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'wetrends.uk@gmail.com',
    href: 'mailto:wetrends.uk@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+44 (0) 1483 XXX XXX',
    href: 'tel:+441483000000',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Guildford, Surrey, UK',
    href: '#',
  },
];

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/wetrends.uk', label: 'Instagram' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/wetrends-uk', label: 'LinkedIn' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative overflow-hidden bg-[#0F0F0F] py-24 md:py-32"
    >
      {/* Large background text */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute -top-10 -right-20 text-[15rem] md:text-[25rem] font-black text-white/[0.02] leading-none select-none">
          HI
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
              <span className="w-8 h-px bg-[#C72C5B]" />
              Get In Touch
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.9]">
              Let&apos;s Work
              <br />
              <span className="font-serif italic text-[#C72C5B]">Together</span>
            </h2>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Description */}
            <p className="text-lg md:text-xl text-white/70 max-w-md">
              Drop us a note. One of our founders will reply within 24 hours and show you how WeTrends can plug straight into your brand.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Link 
                    href={item.href}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C72C5B] text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/50 uppercase tracking-wider">{item.label}</p>
                      <p className="text-white font-medium">{item.value}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-white/30 group-hover:text-[#C72C5B] transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-4"
            >
              <p className="text-xs text-white/50 uppercase tracking-wider mb-4">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white hover:bg-[#C72C5B] hover:border-[#C72C5B] transition-all duration-300"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Service Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="pt-4 border-t border-white/10"
            >
              <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Areas We Serve</p>
              <p className="text-sm text-white/60">
                Guildford • Woking • Farnham • Dorking • Reigate • Leatherhead • Cobham • Esher • Surrey • London • UK-wide
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              {/* Form container with border */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-sm">
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
