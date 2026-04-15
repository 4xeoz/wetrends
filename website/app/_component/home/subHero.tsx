'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Code, Video, Palette, Globe, Lightbulb } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';

const orbitPills = [
  { icon: Code, label: 'Software', delay: 0 },
  { icon: Video, label: 'Video', delay: 0.5 },
  { icon: Palette, label: 'Branding', delay: 1 },
  { icon: Globe, label: 'Web', delay: 1.5 },
  { icon: Lightbulb, label: 'Strategy', delay: 2 },
];

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '£10M+', label: 'Revenue Generated' },
  { value: '100%', label: 'In-House Team' },
];

const positions = [
  { top: '15%', left: '12%' },
  { top: '22%', right: '10%' },
  { top: '55%', left: '8%' },
  { top: '60%', right: '12%' },
  { bottom: '18%', left: '50%', translateX: '-50%' },
];

interface OrbitPillProps {
  pill: typeof orbitPills[0];
  index: number;
  parallaxX: ReturnType<typeof useSpring>;
  parallaxY: ReturnType<typeof useSpring>;
}

const OrbitPill = ({ pill, index, parallaxX, parallaxY }: OrbitPillProps) => {
  const moveX = useTransform(parallaxX, [-0.5, 0.5], [-20 - index * 5, 20 + index * 5]);
  const moveY = useTransform(parallaxY, [-0.5, 0.5], [-15 - index * 3, 15 + index * 3]);
  const pos = positions[index];

  return (
    <motion.div
      style={{
        ...pos,
        x: moveX,
        y: moveY,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute"
    >
      <div
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md"
        style={{
          animation: `floatY ${4 + index * 0.5}s ease-in-out infinite`,
          animationDelay: `${pill.delay}s`,
        }}
      >
        <pill.icon className="h-4 w-4 text-[#C72C5B]" />
        <span className="text-xs font-medium tracking-wide text-white/80">{pill.label}</span>
      </div>
    </motion.div>
  );
};

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

  // Mouse parallax for floating pills
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { stiffness: 60, damping: 20 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  return (
    <section id="subhero" ref={containerRef} className="relative z-20 h-[120svh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-white">
        <motion.div
          style={{ width, height, borderRadius, opacity: cardOpacity }}
          className="relative overflow-hidden bg-[#050505] text-white will-change-[width,height,border-radius]"
          onMouseMove={handleMouseMove}
        >
          {/* Animated gradient orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -left-[20%] -top-[20%] h-[80svw] w-[80svw] rounded-full opacity-40"
              style={{
                background: 'radial-gradient(circle, rgba(199,44,91,0.35) 0%, transparent 70%)',
                animation: 'drift1 20s ease-in-out infinite',
              }}
            />
            <div
              className="absolute -bottom-[30%] -right-[10%] h-[70svw] w-[70svw] rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(188,42,80,0.3) 0%, rgba(80,20,40,0.1) 50%, transparent 70%)',
                animation: 'drift2 25s ease-in-out infinite',
              }}
            />
            <div
              className="absolute left-1/3 top-1/2 h-[40svw] w-[40svw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)',
                animation: 'pulseGlow 8s ease-in-out infinite',
              }}
            />
          </div>

          {/* Noise texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-12 md:px-8">
            
            {/* Floating Orbit Pills - Desktop */}
            <div className="pointer-events-none absolute inset-0 hidden md:block">
              {orbitPills.map((pill, index) => (
                <OrbitPill
                  key={pill.label}
                  pill={pill}
                  index={index}
                  parallaxX={parallaxX}
                  parallaxY={parallaxY}
                />
              ))}
            </div>

            {/* Main Headline */}
            <div className="relative mx-auto max-w-6xl">
              <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.1} ease="power3.out">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#C72C5B] sm:text-base">
                  The Manifesto
                </p>
              </AnimatedContent>

              <AnimatedContent direction="vertical" distance={80} duration={1.2} delay={0.2} ease="power3.out">
                <h2 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight">
                  <span className="block text-white">Engineered</span>
                  <span className="block font-serif italic text-[#C72C5B]">to Stand Out.</span>
                </h2>
              </AnimatedContent>

              <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.4} ease="power3.out">
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg md:mt-8 md:text-xl">
                  In a sea of templates and copy-paste strategies, we craft bespoke digital experiences that command attention, spark emotion, and drive unstoppable growth.
                </p>
              </AnimatedContent>

              {/* Mobile Pills Marquee */}
              <div className="mt-8 flex flex-wrap justify-center gap-2 md:hidden">
                {orbitPills.map((pill) => (
                  <div
                    key={pill.label}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm"
                  >
                    <pill.icon className="h-3.5 w-3.5 text-[#C72C5B]" />
                    <span className="text-xs font-medium text-white/80">{pill.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="absolute bottom-8 left-0 right-0 px-4 sm:bottom-12 sm:px-6 lg:bottom-16">
              <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.6} ease="power3.out">
                <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-6 sm:gap-12 sm:pt-8 md:gap-16 lg:gap-24">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wider text-white/50 sm:text-sm">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedContent>
            </div>
          </div>

          {/* Inline keyframes */}
          <style jsx>{`
            @keyframes drift1 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(10%, 5%) scale(1.1); }
            }
            @keyframes drift2 {
              0%, 100% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(-5%, -10%) scale(1.05); }
            }
            @keyframes pulseGlow {
              0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.2); }
            }
            @keyframes floatY {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
};

export default SubHero;
