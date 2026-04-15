'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Video,
  Palette,
  Globe,
  Users,
  Zap,
  PenTool,
  ArrowUpRight,
  ArrowDownRight,
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
  },
  {
    slug: 'brand-identity',
    number: '02',
    icon: Palette,
    title: 'Brand Identity',
    description: 'Distinctive visual identities, logos, and guidelines that make you unforgettable.',
  },
  {
    slug: 'web-design',
    number: '03',
    icon: Globe,
    title: 'Web Design',
    description: 'High-performing, conversion-focused websites built with Next.js and modern tech.',
  },
  {
    slug: 'social-media',
    number: '04',
    icon: Users,
    title: 'Social Media',
    description: 'Strategic content and community management that turns followers into revenue.',
  },
  {
    slug: 'animation',
    number: '05',
    icon: Zap,
    title: 'Animation',
    description: '2D motion graphics, explainers, and micro-interactions that bring ideas to life.',
  },
  {
    slug: 'content-strategy',
    number: '06',
    icon: PenTool,
    title: 'Content Strategy',
    description: 'SEO-driven copy and editorial that positions you as the authority in your space.',
  },
];

function ServiceRow({ service, index }: { service: typeof services[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;

  return (
    <AnimatedContent
      direction="horizontal"
      distance={40}
      duration={0.8}
      delay={0.05 * index}
      ease="power3.out"
    >
      <Link href={`/services/${service.slug}/`} className="block">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative"
        >
          {/* Top border */}
          <div className="absolute left-0 right-0 top-0 h-px bg-gray-200" />

          {/* Pink hover bar */}
          <motion.div
            className="absolute bottom-0 left-0 top-0 w-1 bg-[#C72C5B]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 0 }}
          />

          {/* Background */}
          <motion.div
            className="absolute inset-0 bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative flex items-center justify-between gap-6 py-8 md:py-10 lg:gap-12">
            {/* Left content */}
            <div className="flex items-center gap-6 md:gap-10 lg:gap-16">
              <span className="w-12 text-sm font-mono text-gray-400 md:w-16 md:text-base">
                {service.number}
              </span>

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-[#0F0F0F] transition-colors group-hover:border-[#C72C5B] group-hover:text-[#C72C5B] md:h-14 md:w-14">
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0F0F0F] transition-transform group-hover:translate-x-2 md:text-3xl lg:text-4xl">
                  {service.title}
                </h3>
                <p className="mt-1 hidden max-w-lg text-gray-500 md:block">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: isHovered ? 0 : -8, opacity: isHovered ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-[#0F0F0F] transition-colors group-hover:border-[#C72C5B] group-hover:bg-[#C72C5B] group-hover:text-white md:h-14 md:w-14"
            >
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45 md:h-6 md:w-6" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </AnimatedContent>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-[100svh] bg-white">
      {/* Dark Cinematic Hero */}
      <section className="relative flex min-h-[80svh] flex-col justify-end pb-12 pt-32 md:min-h-[85svh] md:pb-16 md:pt-40">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero_background.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#050505]/80" />

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
              <span className="block font-serif italic text-[#C72C5B]">Built to Perform.</span>
            </h1>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={40} duration={1} delay={0.4} ease="power3.out">
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 md:mt-8 md:text-lg">
              End-to-end creative solutions that transform brands and accelerate business success. One team. One vision. Zero compromise.
            </p>
          </AnimatedContent>
        </div>
      </section>

      {/* Services Index List */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {services.map((service, index) => (
            <ServiceRow key={service.slug} service={service} index={index} />
          ))}
          {/* Bottom border */}
          <div className="h-px bg-gray-200" />
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-[#050505] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:mb-20">
            <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
              <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
                <span className="h-px w-8 bg-[#C72C5B]" />
                How We Work
              </span>
              <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Simple Process.
                <br />
                <span className="font-serif italic text-[#C72C5B]">Stunning Results.</span>
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

      {/* CTA Section */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <h2 className="mb-6 text-4xl font-bold text-[#0F0F0F] md:text-5xl lg:text-6xl">
              Ready to Start?
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Tell us what you&apos;re building. We&apos;ll handle the rest.
            </p>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 rounded-full bg-[#C72C5B] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#C72C5B]/20 transition-all hover:bg-[#a82448]"
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
