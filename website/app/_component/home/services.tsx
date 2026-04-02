'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Video,
  Palette,
  Globe,
  Users,
  Zap,
  PenTool,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import Link from 'next/link';

const services = [
  {
    number: '01',
    icon: Video,
    title: 'Video Production',
    description: 'Cinematic storytelling that captures attention and drives engagement across all platforms.',
    features: ['Brand Films', 'Social Content', 'Motion Graphics', 'Commercials'],
    color: '#C72C5B',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Brand Identity',
    description: 'Distinctive visual systems that make your brand impossible to ignore.',
    features: ['Logo Design', 'Visual Identity', 'Brand Guidelines', 'Packaging'],
    color: '#8B5CF6',
  },
  {
    number: '03',
    icon: Globe,
    title: 'Web Design',
    description: 'High-converting digital experiences that turn visitors into loyal customers.',
    features: ['UI/UX Design', 'Development', 'E-commerce', 'Web Apps'],
    color: '#3B82F6',
  },
  {
    number: '04',
    icon: Users,
    title: 'Social Media',
    description: 'Strategic content that builds communities and sparks meaningful conversations.',
    features: ['Content Strategy', 'Creative Direction', 'Community', 'Analytics'],
    color: '#10B981',
  },
  {
    number: '05',
    icon: Zap,
    title: 'Animation',
    description: 'Dynamic motion design that brings your brand story to life.',
    features: ['2D Animation', 'Motion Graphics', 'Explainers', 'Micro-interactions'],
    color: '#F59E0B',
  },
  {
    number: '06',
    icon: PenTool,
    title: 'Content Strategy',
    description: 'Data-driven narratives that position you as the authority in your space.',
    features: ['SEO Content', 'Copywriting', 'Editorial', 'Storytelling'],
    color: '#EC4899',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const slug = service.title.toLowerCase().replace(' ', '-');

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      className="group relative"
    >
      <Link href={`/services/${slug}/`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-sm p-8 md:p-12 cursor-pointer"
        >
          {/* Color Hover Background */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-5"
            style={{ backgroundColor: service.color }}
          />

          {/* Number */}
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="absolute right-8 top-8 text-8xl font-bold text-gray-100 md:text-9xl"
            style={{ WebkitTextStroke: `1px ${service.color}20` }}
          >
            {service.number}
          </motion.span>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon & Title Row */}
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <service.icon className="h-8 w-8" style={{ color: service.color }} />
                </motion.div>
                <div>
                  <span className="text-sm font-medium" style={{ color: service.color }}>
                    {service.number}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {service.title}
                  </h3>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 45 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-colors group-hover:border-gray-400 group-hover:text-gray-700"
              >
                <ArrowUpRight className="h-5 w-5" />
              </motion.div>
            </div>

            {/* Description */}
            <p className="mb-8 max-w-lg text-lg text-gray-600">
              {service.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3">
              {service.features.map((feature, i) => (
                <motion.span
                  key={feature}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
                >
                  {feature}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Bottom Line Animation */}
          <motion.div
            className="absolute bottom-0 left-0 h-1"
            style={{ backgroundColor: service.color }}
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative min-h-screen overflow-hidden bg-gray-50 py-32 md:py-40 flex items-center"
    >
      {/* Subtle decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-48 top-0 h-[600px] w-[600px] rounded-full bg-[#C72C5B]/5" />
        <div className="absolute -left-48 bottom-0 h-[400px] w-[400px] rounded-full bg-[#3B82F6]/5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <motion.div
          style={{ y: headerY }}
          className="mb-20 text-center"
        >
          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1}
            ease="power3.out"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C72C5B]/30 bg-[#C72C5B]/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-[#C72C5B]" />
              <span className="text-sm font-medium text-[#C72C5B]">
                What We Do
              </span>
            </div>
          </AnimatedContent>

          <AnimatedContent
            direction="vertical"
            distance={80}
            duration={1.2}
            delay={0.1}
            ease="power3.out"
          >
            <h2 className="mb-6 text-5xl font-bold leading-none text-[#0F0F0F] md:text-6xl lg:text-7xl xl:text-8xl">
              Services That
              <br />
              <span className="font-serif italic text-[#C72C5B]">
                Drive Growth
              </span>
            </h2>
          </AnimatedContent>

          <AnimatedContent
            direction="vertical"
            distance={60}
            duration={1.2}
            delay={0.2}
            ease="power3.out"
          >
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              From concept to execution, we deliver end-to-end creative solutions
              that transform brands and accelerate business success.
            </p>
          </AnimatedContent>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatedContent
          direction="vertical"
          distance={60}
          duration={1}
          delay={0.4}
          ease="power3.out"
          className="mt-20 text-center"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-4 rounded-full bg-[#C72C5B] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#C72C5B]/20 transition-all hover:bg-[#A3244A] hover:shadow-[#C72C5B]/30"
          >
            Start Your Project
            <motion.span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white"
              whileHover={{ scale: 1.1, rotate: 45 }}
            >
              <ArrowUpRight className="h-5 w-5" />
            </motion.span>
          </motion.a>
        </AnimatedContent>
      </div>
    </section>
  );
}
