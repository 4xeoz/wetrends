'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Where does the shoot take place?',
    a: 'We shoot on the University of Surrey campus in Guildford — outside the cathedral, around the Stag Hill buildings, or anywhere you prefer nearby. Just let us know your preferred spot when you book.',
  },
  {
    q: 'Can my friends and I all book on the same graduation day?',
    a: "Absolutely. We work all day on your graduation date, so multiple students can book the same day without any issue. Just each book your own slot — we'll fit everyone in.",
  },
  {
    q: 'How long does the shoot take?',
    a: 'A typical session is 20–30 minutes — quick, relaxed and efficient. We know you have family waiting and celebrations to get to, so we make the most of your time without any fuss.',
  },
  {
    q: 'How do I receive my photos and video?',
    a: 'We deliver everything digitally within 48 hours of your shoot. You\'ll receive a download link straight to your inbox with all your high-resolution files, ready to share, print or post.',
  },
  {
    q: 'What if I want changes to my photos after delivery?',
    a: "Your satisfaction matters. If there's something you're not happy with — colour, crop, edit style — just tell us and we'll adjust it. We want you to love every single photo.",
  },
  {
    q: 'Is the video in the Premium package optimised for LinkedIn?',
    a: 'Yes. The short cinematic reel is exported in a square or portrait format ideal for LinkedIn, Instagram Reels, and TikTok. We also export a 16:9 version on request.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-900">{q}</span>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-gray-600">{a}</p>
      )}
    </div>
  );
}

export default function CinematographyFaq() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            FAQ
          </p>
          <h2 className="text-3xl font-black text-gray-900 sm:text-4xl">
            Questions? We&apos;ve Got Answers.
          </h2>
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-gray-200 bg-white px-6 shadow-sm">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} {...faq} />
          ))}
        </div>

        {/* Still have questions */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Still have a question?{' '}
          <Link
            href="/#contact"
            className="font-semibold text-[#C72C5B] underline-offset-2 hover:underline"
          >
            Drop us a message
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
