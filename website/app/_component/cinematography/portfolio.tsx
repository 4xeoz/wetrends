import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const portfolioImages = [
  {
    src: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80',
    alt: 'Graduation portrait at University of Surrey campus',
    tall: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=75',
    alt: 'Graduate celebrating at Guildford ceremony',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=75',
    alt: 'Graduation cap in the air, Surrey University',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&q=75',
    alt: 'Student portrait on graduation day',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?w=600&q=75',
    alt: 'Graduate holding diploma outdoors Guildford',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
    alt: 'Group of Surrey University graduates celebrating',
    tall: false,
  },
];

export default function CinematographyPortfolio() {
  return (
    <section id="work" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out" className="mb-12 md:mb-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                Our Work
              </span>
              <h2 className="text-4xl font-bold leading-none text-[#0F0F0F] md:text-5xl lg:text-6xl xl:text-7xl">
                Real Graduates.
                <br />
                <span className="font-serif italic text-[#C72C5B]">Real Moments.</span>
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-gray-500 md:text-right">
              Every shoot is unique — here&apos;s a taste of what we create at Surrey
              University and across Guildford.
            </p>
          </div>
        </AnimatedContent>

        {/* Grid */}
        <div className="grid auto-rows-[240px] grid-cols-2 gap-3 md:grid-cols-3 lg:auto-rows-[280px]">
          {portfolioImages.map((img, i) => (
            <AnimatedContent
              key={img.src}
              direction="vertical"
              distance={40}
              duration={0.7}
              delay={i * 0.07}
              ease="power3.out"
              className={img.tall ? 'row-span-2' : ''}
            >
              <div className="group relative h-full overflow-hidden rounded-3xl bg-gray-100">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading={i < 2 ? 'eager' : 'lazy'}
                  className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>
            </AnimatedContent>
          ))}
        </div>

        {/* Disclaimer + CTA row */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400">
            Sample portfolio — your photos will be tailored to your graduation day
          </p>
          <Link
            href="#book"
            className="group inline-flex items-center gap-2 rounded-full border border-[#0F0F0F] px-6 py-3 text-sm font-bold text-[#0F0F0F] transition-all hover:bg-[#0F0F0F] hover:text-white"
          >
            Book Your Shoot
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  );
}
