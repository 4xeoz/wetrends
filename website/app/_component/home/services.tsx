'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Video,
  Palette,
  Globe,
  Users,
  Zap,
  PenTool,
  ArrowUpRight,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    number: '01',
    icon: Video,
    title: 'Video Production',
    description: 'Cinematic storytelling that captivates audiences and drives engagement across all platforms.',
  },
  {
    number: '02',
    icon: Palette,
    title: 'Brand Identity',
    description: 'Visual systems that demand attention and create lasting impressions.',
  },
  {
    number: '03',
    icon: Globe,
    title: 'Web Design',
    description: 'High-converting digital experiences that turn visitors into customers.',
  },
  {
    number: '04',
    icon: Users,
    title: 'Social Media',
    description: 'Content strategies that build communities and foster brand loyalty.',
  },
  {
    number: '05',
    icon: Zap,
    title: 'Animation',
    description: 'Motion design that brings brands to life with dynamic storytelling.',
  },
  {
    number: '06',
    icon: PenTool,
    title: 'Content Strategy',
    description: 'Stories that position you as the expert in your industry.',
  },
];

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B]">
              <span className="w-8 h-px bg-[#C72C5B]" />
              What We Do
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#0F0F0F] leading-[0.9]">
              Services That
              <br />
              <span className="font-serif italic text-[#C72C5B]">Drive Growth</span>
            </h2>
          </motion.div>
        </div>

        {/* Services List */}
        <div className="space-y-0">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Link href={`/services/${service.title.toLowerCase().replace(' ', '-')}/`}>
                <motion.div
                  className="group relative cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Top border */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gray-200" />

                  {/* Background expand on hover */}
                  <motion.div
                    className="absolute inset-0 bg-[#0F0F0F]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originX: 0 }}
                  />

                  {/* Main content */}
                  <div className="relative py-6 md:py-8">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Number + Icon + Title */}
                      <div className="flex items-center gap-4 md:gap-8">
                        {/* Number */}
                        <span className={`text-sm font-mono transition-colors duration-300 min-w-[2rem] ${
                          hoveredIndex === index ? 'text-[#C72C5B]' : 'text-gray-400'
                        }`}>
                          {service.number}
                        </span>

                        {/* Icon */}
                        <div className={`hidden md:flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                          hoveredIndex === index 
                            ? 'bg-[#C72C5B] text-white' 
                            : 'bg-gray-100 text-[#0F0F0F]'
                        }`}>
                          <service.icon className="h-5 w-5" />
                        </div>

                        {/* Title */}
                        <h3 className={`text-xl md:text-3xl lg:text-4xl font-bold transition-colors duration-300 ${
                          hoveredIndex === index ? 'text-white' : 'text-[#0F0F0F]'
                        }`}>
                          {service.title}
                        </h3>
                      </div>

                      {/* Right: Description (shows on hover) + Arrow */}
                      <div className="flex items-center gap-4 md:gap-8">
                        {/* Description - visible on hover */}
                        <motion.p
                          className="hidden lg:block max-w-xs text-sm text-white/70"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ 
                            opacity: hoveredIndex === index ? 1 : 0,
                            x: hoveredIndex === index ? 0 : 20
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {service.description}
                        </motion.p>

                        {/* Arrow */}
                        <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border transition-all duration-300 ${
                          hoveredIndex === index 
                            ? 'border-[#C72C5B] bg-[#C72C5B] text-white' 
                            : 'border-gray-200 text-gray-400'
                        }`}>
                          <ArrowUpRight className={`h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 ${
                            hoveredIndex === index ? 'rotate-45' : ''
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last item border */}
                  {index === services.length - 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 md:mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl border border-gray-200 bg-gray-50 p-8 md:p-10"
        >
          <div>
            <p className="text-xl md:text-2xl font-bold text-[#0F0F0F]">
              Ready to transform your brand?
            </p>
            <p className="mt-1 text-gray-500">
              Let&apos;s discuss how we can help you grow.
            </p>
          </div>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-[#C72C5B] px-8 py-4 font-bold text-white transition-all hover:bg-[#0F0F0F]"
          >
            Start Your Project
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
