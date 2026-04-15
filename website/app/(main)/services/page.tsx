'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Palette,
  Globe,
  Users,
  Zap,
  PenTool,
  ArrowUpRight,
  ArrowDownRight,
  Play,
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import Link from 'next/link';

const services = [
  {
    slug: 'video-production',
    number: '01',
    icon: Video,
    title: 'Video Production',
    description: 'Cinematic brand films, social content, and motion graphics that stop the scroll.',
    video: '/videos/video-preview-wetrends.mp4',
  },
  {
    slug: 'brand-identity',
    number: '02',
    icon: Palette,
    title: 'Brand Identity',
    description: 'Distinctive visual identities, logos, and guidelines that make you unforgettable.',
    video: '/videos/design-preview-wetrends.mp4',
  },
  {
    slug: 'web-design',
    number: '03',
    icon: Globe,
    title: 'Web Design',
    description: 'High-performing, conversion-focused websites built with Next.js and modern tech.',
    video: '/videos/website-preview-wetrends.mp4',
  },
  {
    slug: 'social-media',
    number: '04',
    icon: Users,
    title: 'Social Media',
    description: 'Strategic content and community management that turns followers into revenue.',
    video: '/videos/social-preview-wetrends.mp4',
  },
  {
    slug: 'animation',
    number: '05',
    icon: Zap,
    title: 'Animation',
    description: '2D motion graphics, explainers, and micro-interactions that bring ideas to life.',
    video: '/videos/animations-preview-wetrends.mp4',
  },
  {
    slug: 'content-strategy',
    number: '06',
    icon: PenTool,
    title: 'Content Strategy',
    description: 'SEO-driven copy and editorial that positions you as the authority in your space.',
    video: '/videos/design-preview-wetrends.mp4',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) videoRef.current.play();
      else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <AnimatedContent
      direction="vertical"
      distance={60}
      duration={0.8}
      delay={0.08 * index}
      ease="power3.out"
    >
      <Link href={`/services/${service.slug}/`} className="block">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F0F] md:aspect-[16/10] lg:aspect-[16/9]"
        >
          {/* Video background */}
          <video
            ref={videoRef}
            src={service.video}
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-[#050505]/60"
            animate={{ opacity: isHovered ? 0.3 : 0.6 }}
            transition={{ duration: 0.4 }}
          />

          {/* Accent line top */}
          <motion.div
            className="absolute left-0 right-0 top-0 h-1 bg-[#C72C5B]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ originX: 0 }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between">
              <span className="text-sm font-mono text-white/50">{service.number}</span>
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C72C5B] text-white md:h-12 md:w-12"
              >
                <Play className="h-4 w-4 fill-current md:h-5 md:w-5" />
              </motion.div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm md:h-12 md:w-12">
                  <Icon className="h-4 w-4 text-white md:h-5 md:w-5" />
                </div>
                <h3 className="text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                  {service.title}
                </h3>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">
                {service.description}
              </p>

              <motion.div
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C72C5B]"
                animate={{ x: isHovered ? 8 : 0 }}
                transition={{ duration: 0.3 }}
              >
                Explore Service
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </AnimatedContent>
  );
}

export default function ServicesPage() {
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-[100svh] bg-[#050505]">
      {/* Hero — Video Crossfade Background */}
      <section className="relative flex min-h-[85svh] flex-col justify-end pb-12 pt-32 md:min-h-[90svh] md:pb-16 md:pt-40">
        {/* Background videos crossfade */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.div
              key={activeVideo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <video
                src={services[activeVideo].video}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.1} ease="power3.out">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-[#C72C5B]">
              What We Do
            </p>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={80} duration={1.2} delay={0.2} ease="power3.out">
            <h1 className="max-w-4xl text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.85] tracking-tight text-white">
              <span className="block">Services</span>
              <span className="block font-serif italic text-[#C72C5B]">In Motion.</span>
            </h1>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.4} ease="power3.out">
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:mt-8 md:text-lg">
              Six creative disciplines. One unified team. Scroll down to see what we can build together.
            </p>
          </AnimatedContent>

          {/* Video indicators */}
          <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.5} ease="power3.out">
            <div className="mt-8 flex items-center gap-3">
              {services.map((s, i) => (
                <button
                  key={s.slug}
                  onClick={() => setActiveVideo(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === activeVideo ? 'w-10 bg-[#C72C5B]' : 'w-4 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Show ${s.title} video`}
                />
              ))}
            </div>
          </AnimatedContent>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out" className="mb-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Browse Our <span className="font-serif italic text-[#C72C5B]">Work</span>
              </h2>
              <span className="hidden text-sm text-white/50 md:block">
                Hover to preview
              </span>
            </div>
          </AnimatedContent>

          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Dark Process */}
      <section className="border-t border-white/10 bg-[#050505] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:mb-20">
            <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                How We Work
              </span>
              <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                From Brief to <span className="font-serif italic text-[#C72C5B]"> brilliance.</span>
              </h2>
            </AnimatedContent>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '01', title: 'Discover', desc: 'We dive deep into your brand, goals, and audience.' },
              { step: '02', title: 'Design', desc: 'We craft concepts that bring your vision to life.' },
              { step: '03', title: 'Develop', desc: 'We build, film, animate, and write with precision.' },
              { step: '04', title: 'Deliver', desc: 'We launch, optimize, and support your growth.' },
            ].map((item, index) => (
              <AnimatedContent
                key={item.step}
                direction="vertical"
                distance={50}
                duration={0.8}
                delay={0.1 * index}
                ease="power3.out"
              >
                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-[#C72C5B]/50 md:p-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#C72C5B]">
                    {item.step}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-white md:text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{item.desc}</p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C72C5B] py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Ready to Create?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Tell us what you&apos;re building. We&apos;ll handle the rest.
            </p>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-[#C72C5B] shadow-lg transition-all hover:bg-gray-100"
            >
              Start Your Project
              <ArrowDownRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </motion.a>
          </AnimatedContent>
        </div>
      </section>
    </main>
  );
}
