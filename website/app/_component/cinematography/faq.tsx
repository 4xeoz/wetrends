'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const faqs = [
  {
    q: 'Where does the shoot take place?',
    a: 'We shoot on the University of Surrey campus in Guildford — outside the cathedral, around Stag Hill, or anywhere you prefer nearby. Just let us know your preferred spot when you book.',
  },
  {
    q: 'Can my friends and I all book on the same graduation day?',
    a: "Absolutely. We work all day on your graduation date so multiple students can book the same day. Just each book your own slot — we will fit everyone in.",
  },
  {
    q: 'How long does the shoot take?',
    a: 'A typical session is 20–30 minutes — quick, relaxed and efficient. We know you have family waiting and celebrations to get to, so we make the most of every minute.',
  },
  {
    q: 'How do I receive my photos and video?',
    a: "We deliver everything digitally within 48 hours of your shoot. You will receive a download link straight to your inbox with all your high-resolution files, ready to share, print or post.",
  },
  {
    q: 'What if I want changes after delivery?',
    a: "Your satisfaction matters. If there is something you are not happy with — colour, crop, edit style — just tell us and we will adjust it. We want you to love every single photo.",
  },
  {
    q: 'Is the video in the Premium package optimised for LinkedIn?',
    a: 'Yes. The short cinematic reel is exported in square or portrait format ideal for LinkedIn, Instagram Reels, and TikTok. We also export a 16:9 version on request.',
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 py-6 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-4">
          <span className="mt-0.5 font-mono text-xs text-gray-400">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-sm font-semibold text-[#0F0F0F] sm:text-base">{q}</span>
        </div>
        <ChevronDown
          className={`mt-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180 text-[#C72C5B]' : ''
          }`}
        />
      </button>
      {open && (
        <p className="pb-6 pl-10 text-sm leading-relaxed text-gray-600 sm:text-base">
          {a}
        </p>
      )}
    </div>
  );
}

export default function CinematographyFaq() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Left — heading */}
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out" threshold={0.1}>
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
              <span className="h-px w-8 bg-[#C72C5B]" />
              FAQ
            </span>
            <h2 className="text-4xl font-bold leading-none text-[#0F0F0F] md:text-5xl lg:text-6xl">
              Questions?
              <br />
              <span className="font-serif italic text-[#C72C5B]">We&apos;ve Got Answers.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-500">
              Everything you need to know before you book. Still have a question?
            </p>
            <Link
              href="/#contact"
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-[#0F0F0F] px-6 py-3 text-sm font-bold text-[#0F0F0F] transition-all hover:bg-[#0F0F0F] hover:text-white"
            >
              Drop us a message
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </AnimatedContent>

          {/* Right — accordion */}
          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.15} ease="power3.out" threshold={0.1}>
            <div className="rounded-3xl border border-gray-200 bg-white px-6 shadow-sm sm:px-8">
              {faqs.map((faq, i) => (
                <FaqItem key={faq.q} index={i} {...faq} />
              ))}
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
