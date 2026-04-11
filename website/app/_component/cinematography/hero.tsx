'use client';

import Image from 'next/image';
import { Star, Clock, ShieldCheck, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CinematographyHero() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        {/* Subtle top-right decorative blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-[#C72C5B]/6 blur-3xl"
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 lg:px-8">
          {/* ── LEFT: Copy ── */}
          <div className="order-2 lg:order-1">
            {/* Location badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C72C5B]/20 bg-[#C72C5B]/5 px-3 py-1.5 text-xs font-semibold text-[#C72C5B] tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C72C5B] animate-pulse" />
              University of Surrey · Guildford
            </div>

            {/* H1 */}
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem]">
              Graduation Photos
              <br />
              <span className="text-[#C72C5B]">You&apos;ll Love Forever</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-lg leading-relaxed text-gray-600 max-w-lg">
              Professional photography &amp; cinematic video for{' '}
              <strong className="font-semibold text-gray-800">
                Surrey University graduates
              </strong>
              . Stunning edits delivered straight to your inbox in 48 hours.
            </p>

            {/* Inline star rating */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">5.0</span>
              <span className="text-sm text-gray-500">· 200+ happy graduates</span>
            </div>

            {/* Price anchors */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
                <span className="text-lg font-black text-gray-900">£35</span>
                <span className="text-sm text-gray-500">· 8 photos</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#C72C5B]/30 bg-[#C72C5B]/5 px-4 py-2.5">
                <span className="text-lg font-black text-[#C72C5B]">£45</span>
                <span className="text-sm text-gray-600">· 10 photos + video</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#book">
                <Button className="rounded-full bg-[#C72C5B] px-7 py-5 text-sm font-bold text-white shadow-md shadow-[#C72C5B]/25 hover:bg-[#a8244d] transition-colors">
                  Book Your Shoot
                </Button>
              </a>
              <a href="#work">
                <Button
                  variant="outline"
                  className="rounded-full border-gray-300 px-7 py-5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  See Our Work
                </Button>
              </a>
            </div>

            {/* Trust micro-copy */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              {[
                { icon: Clock, text: '48h guaranteed delivery' },
                { icon: ShieldCheck, text: 'Satisfaction guarantee' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-xs text-gray-500"
                >
                  <Icon className="h-3.5 w-3.5 text-[#C72C5B]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Hero image ── */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Main image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-gray-200 aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1627556704302-624286467c65?w=900&q=85"
                  alt="Graduation portrait at University of Surrey, Guildford"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Floating badge — delivery */}
              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C72C5B]/10">
                  <Clock className="h-4 w-4 text-[#C72C5B]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">48h Delivery</p>
                  <p className="text-[10px] text-gray-500">Guaranteed</p>
                </div>
              </div>

              {/* Floating badge — price */}
              <div className="absolute -right-4 top-6 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Starting from
                </p>
                <p className="text-xl font-black text-[#C72C5B]">£35</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 lg:flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase tracking-widest text-gray-400">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-gray-300" />
        </div>
      </section>

      {/* Bottom border */}
      <div className="h-px bg-gray-100" />
    </>
  );
}
