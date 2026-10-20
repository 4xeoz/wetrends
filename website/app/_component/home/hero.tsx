import Link from 'next/link';
import Image from 'next/image';
import { ArrowDownRight } from 'lucide-react';
import HeroMesh from './hero-mesh';

export default function Hero() {
  return (
    <section className="relative isolate flex h-[100svh] min-h-[600px] w-full flex-col overflow-hidden bg-[#85172E] pt-[72px]">
      {/* The small source WebP paints first; the shader fades in after its first frame. */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero_background.webp"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="wt-mobile-mesh-orbit pointer-events-none absolute -inset-[12%] md:hidden" aria-hidden="true" />
        <div className="wt-mobile-mesh-cross pointer-events-none absolute -inset-[12%] md:hidden" aria-hidden="true" />
        <HeroMesh />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            We build <em className="font-serif font-normal">brands</em>
            <br />
            <em className="font-serif font-normal">that refuse to</em>{' '}
            <span className="relative inline-block">
              blend in
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30" />
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:mt-6 md:text-lg">
            Software development, brand strategy, and creative execution — we&apos;re the technical partner that helps businesses solve problems and scale.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#C72C5B] transition-colors hover:bg-gray-100 sm:px-7 sm:py-3.5 sm:text-base md:px-8"
            >
              Start Your Project
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C72C5B] text-white transition-transform group-hover:rotate-45 sm:h-8 sm:w-8">
                <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center pb-6">
        <Link href="#subhero" className="flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-white sm:gap-2">
          <span className="text-[10px] uppercase tracking-widest sm:text-xs">Scroll</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 sm:h-10 sm:w-10">
            <ArrowDownRight className="h-3.5 w-3.5 rotate-45 sm:h-4 sm:w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
