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
    color: '#C72C5B'
  },
  {
    number: '02',
    icon: Palette,
    title: 'Brand Identity',
    description: 'Visual systems that demand attention and create lasting impressions.',
    color: '#0F0F0F'
  },
  {
    number: '03',
    icon: Globe,
    title: 'Web Design',
    description: 'High-converting digital experiences that turn visitors into customers.',
    color: '#C72C5B'
  },
  {
    number: '04',
    icon: Users,
    title: 'Social Media',
    description: 'Content strategies that build communities and foster brand loyalty.',
    color: '#0F0F0F'
  },
  {
    number: '05',
    icon: Zap,
    title: 'Animation',
    description: 'Motion design that brings brands to life with dynamic storytelling.',
    color: '#C72C5B'
  },
  {
    number: '06',
    icon: PenTool,
    title: 'Content Strategy',
    description: 'Stories that position you as the expert in your industry.',
    color: '#0F0F0F'
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
      className="relative overflow-hidden bg-[#0F0F0F] py-24 md:py-32"
    >
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Large typography */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-6 inline-block text-sm font-bold uppercase tracking-[0.3em] text-[#C72C5B]">
              What We Do
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-[0.85] tracking-tight">
              OUR
              <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #C72C5B' }}>
                SERVICES
              </span>
            </h2>
          </motion.div>
        </div>

        {/* Services - Accordion Style */}
        <div className="space-y-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Link href={`/services/${service.title.toLowerCase().replace(' ', '-')}/`}>
                <motion.div
                  className="group relative cursor-pointer overflow-hidden"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Background expand on hover */}
                  <motion.div
                    className="absolute inset-0 bg-[#C72C5B]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originX: 0 }}
                  />

                  {/* Main content */}
                  <div className="relative border-t border-white/10 py-6 md:py-8">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Number + Icon + Title */}
                      <div className="flex items-center gap-4 md:gap-8">
                        {/* Number */}
                        <span className={`text-sm font-mono transition-colors duration-300 ${
                          hoveredIndex === index ? 'text-white' : 'text-[#C72C5B]'
                        }`}>
                          {service.number}
                        </span>

                        {/* Icon */}
                        <div className={`hidden md:flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
                          hoveredIndex === index 
                            ? 'border-white bg-white text-[#C72C5B]' 
                            : 'border-white/20 text-white'
                        }`}>
                          <service.icon className="h-5 w-5" />
                        </div>

                        {/* Title */}
                        <h3 className={`text-2xl md:text-4xl lg:text-5xl font-bold transition-colors duration-300 ${
                          hoveredIndex === index ? 'text-white' : 'text-white'
                        }`}>
                          {service.title}
                        </h3>
                      </div>

                      {/* Right: Description (shows on hover) + Arrow */}
                      <div className="flex items-center gap-4 md:gap-8">
                        {/* Description - visible on hover */}
                        <motion.p
                          className="hidden lg:block max-w-xs text-sm text-white/80"
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
                        <div className={`flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full border transition-all duration-300 ${
                          hoveredIndex === index 
                            ? 'border-white bg-white text-[#C72C5B]' 
                            : 'border-white/20 text-white'
                        }`}>
                          <ArrowUpRight className={`h-4 w-4 md:h-6 md:w-6 transition-transform duration-300 ${
                            hoveredIndex === index ? 'rotate-45' : ''
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last item border */}
                  {index === services.length - 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
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
          className="mt-16 md:mt-24 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <p className="text-lg md:text-xl text-white/60 text-center md:text-left">
            Ready to transform your brand?
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-[#0F0F0F] transition-all hover:bg-[#C72C5B] hover:text-white"
          >
            Start Your Project
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
