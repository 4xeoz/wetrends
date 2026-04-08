'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { Linkedin, Instagram, MapPin, Mail, ArrowUpRight } from 'lucide-react';
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
      className="relative overflow-hidden py-16 sm:py-24 md:py-32"
    >
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/images/footer_background.webp"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-3 sm:mb-4 inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#C72C5B]">
              <span className="w-6 sm:w-8 h-px bg-[#C72C5B]" />
              Get In Touch
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.9]">
              Let&apos;s Work
              <br />
              <span className="font-serif italic text-[#C72C5B]">Together</span>
            </h2>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-md">
              Drop us a note. One of our founders will reply within 24 hours and show you how WeTrends can plug straight into your brand.
            </p>

            {/* Contact Cards */}
            <div className="space-y-3 sm:space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Link 
                    href={item.href}
                    className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#C72C5B] text-white">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm sm:text-base text-white font-medium truncate">{item.value}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-white/30 group-hover:text-[#C72C5B] transition-colors flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="pt-2 sm:pt-4"
            >
              <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider mb-3 sm:mb-4">Follow Us</p>
              <div className="flex gap-2 sm:gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 text-white hover:bg-[#C72C5B] hover:border-[#C72C5B] transition-all duration-300"
                  >
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Service Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="pt-3 sm:pt-4 border-t border-white/10"
            >
              <p className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider mb-2 sm:mb-3">Areas We Serve</p>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                Guildford • Woking • Farnham • Dorking • Reigate • Leatherhead • Cobham • Esher • Surrey • London • UK-wide
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Progressive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              {/* Form container with border */}
              <div className="absolute -inset-px rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
              <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8 backdrop-blur-sm">
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
