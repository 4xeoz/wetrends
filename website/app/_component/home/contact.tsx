'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Linkedin, Instagram, MapPin, Mail, ArrowUpRight, Send } from 'lucide-react';
import { submitContactForm } from '@/actions/contact';
import Link from 'next/link';

const services = [
  'Video Production',
  'Brand Identity',
  'Web Design',
  'Social Media',
  'Animation',
  'Content Strategy',
  'Other',
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim()) newErrors.email = 'Please enter your email';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.message.trim()) newErrors.message = 'Please tell us about your project';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', service: '', message: '' });
      }
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="relative bg-[#0F0F0F]">
      {/* Top — Massive headline */}
      <div className="px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-7xl"
        >
          <span className="mb-6 inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#C72C5B]">
            Contact
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 80 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-7xl text-[clamp(3.5rem,11vw,10rem)] font-bold leading-[0.85] tracking-tight text-white"
        >
          Start something
          <br />
          worth talking{' '}
          <span className="font-serif italic text-[#C72C5B]">about.</span>
        </motion.h2>
      </div>

      {/* Email hero link */}
      <div className="px-6 pt-12 sm:px-10 sm:pt-16 lg:px-16 lg:pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto max-w-7xl"
        >
          <Link
            href="mailto:wetrends.uk@gmail.com"
            className="group inline-flex items-center gap-4 border-b border-white/20 pb-4 text-2xl font-bold text-white transition-colors hover:border-[#C72C5B] hover:text-[#C72C5B] sm:text-3xl md:text-4xl"
          >
            <Mail className="h-6 w-6 sm:h-8 sm:w-8" />
            wetrends.uk@gmail.com
            <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </motion.div>
      </div>

      {/* Split Section — Black left / Pink right */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2">
        {/* Left — Contact info on black */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col justify-between px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
        >
          <div className="space-y-12">
            {/* Location */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                Where to find us
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
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                Follow along
              </p>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/wetrends.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-lg font-bold text-white transition-colors hover:text-[#C72C5B]"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
                </a>
                <a
                  href="https://www.linkedin.com/company/wetrends-uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-lg font-bold text-white transition-colors hover:text-[#C72C5B]"
                >
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
                </a>
              </div>
            </div>

            {/* Areas */}
            <div className="border-t border-white/10 pt-8">
              <p className="text-sm leading-relaxed text-white/40">
                Serving Guildford, Woking, Farnham, Dorking, Reigate,
                Leatherhead, Cobham, Esher, Surrey, London and UK wide.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right — Form on pink */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[#C72C5B] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
        >
          {isSubmitted ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white">
                <Send className="h-8 w-8 text-[#C72C5B]" />
              </div>
              <h3 className="text-3xl font-bold text-white">Message Sent</h3>
              <p className="mt-2 text-lg text-white/80">
                We will be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full border-0 border-b border-white/30 bg-transparent pb-3 text-xl font-bold text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-white">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full border-0 border-b border-white/30 bg-transparent pb-3 text-xl font-bold text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-white">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  Service
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full cursor-pointer border-0 border-b border-white/30 bg-transparent pb-3 text-xl font-bold text-white focus:border-white focus:outline-none"
                >
                  <option value="" className="bg-[#C72C5B] text-white">
                    Select a service
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-[#C72C5B] text-white">
                      {s}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="mt-2 text-sm text-white">{errors.service}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  Project
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  rows={3}
                  className="w-full resize-none border-0 border-b border-white/30 bg-transparent pb-3 text-xl font-bold text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-white">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-[#0F0F0F] py-5 text-base font-bold text-white transition-all hover:bg-white hover:text-[#0F0F0F] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending
                  </span>
                ) : (
                  <>
                    Send Message
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row sm:px-10 lg:px-16">
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
