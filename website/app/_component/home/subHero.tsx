'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import AnimatedContent from '@/components/ui/animated-content';

const SubHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const width = useTransform(scrollYProgress, [0, 0.7], ['85%', '100%']);
  const height = useTransform(scrollYProgress, [0, 0.7], ['75%', '100%']);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], ['2rem', '0rem']);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);

  return (
    <section id="subhero" ref={containerRef} className="relative z-20 h-[100svh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-white">
        <motion.div
          style={{ width, height, borderRadius, opacity: cardOpacity }}
          className="relative overflow-hidden bg-[#0F0F0F] text-white will-change-[width,height,border-radius]"
        >
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -right-20 top-0 h-[300px] w-[300px] rounded-full bg-[#C72C5B]/10 blur-[100px] md:-right-40 md:h-[500px] md:w-[500px] md:blur-[120px]" />

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center overflow-y-auto px-4 py-8 text-center sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16">
            <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.1} ease="power3.out">
              <h2 className="mx-auto max-w-4xl text-2xl font-bold leading-[1.15] sm:text-3xl md:text-4xl md:leading-[1.1] lg:text-5xl xl:text-6xl">
                We embed like <span className="font-serif italic text-[#C72C5B]">co-founders</span>,
                <br className="hidden sm:block" />
                {' '}treat every win as our own.
              </h2>
            </AnimatedContent>

            <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.2} ease="power3.out">
              <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400 sm:mt-4 sm:text-base md:mt-6 md:text-lg">
                Most agencies hand off files and disappear. We safeguard your brand&apos;s identity and drive long-term growth — not a one-off gig.
              </p>
            </AnimatedContent>

            {/* Three pillars */}
            <div className="mt-8 grid w-full max-w-5xl gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 md:mt-14 md:gap-5 lg:mt-16">
              <AnimatedContent direction="vertical" distance={20} duration={0.6} delay={0.3} ease="power3.out">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-colors hover:border-[#C72C5B]/50 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C72C5B] sm:text-sm">01</span>
                  <h3 className="mt-2 text-base font-bold sm:mt-3 sm:text-lg md:text-xl">Radar & Strategy</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400 sm:mt-2 sm:text-sm">
                    We scan live culture data each week and agree on the winning idea in one call.
                  </p>
                </div>
              </AnimatedContent>

              <AnimatedContent direction="vertical" distance={20} duration={0.6} delay={0.4} ease="power3.out">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-colors hover:border-[#C72C5B]/50 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C72C5B] sm:text-sm">02</span>
                  <h3 className="mt-2 text-base font-bold sm:mt-3 sm:text-lg md:text-xl">Hands-Free Production</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400 sm:mt-2 sm:text-sm">
                    We design, edit and format the approved concept into publish-ready creative.
                  </p>
                </div>
              </AnimatedContent>
              
              <AnimatedContent direction="vertical" distance={20} duration={0.6} delay={0.5} ease="power3.out">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-colors hover:border-[#C72C5B]/50 sm:rounded-2xl sm:p-5 md:p-6 lg:p-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C72C5B] sm:text-sm">03</span>
                  <h3 className="mt-2 text-base font-bold sm:mt-3 sm:text-lg md:text-xl">Launch & Optimize</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400 sm:mt-2 sm:text-sm">
                    You publish, we monitor then refine next week&apos;s sprint for compounding growth.
                  </p>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SubHero;
