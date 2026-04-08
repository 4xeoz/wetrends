'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const caseStudies = [
  {
    id: '01',
    client: 'Surrey Wellness',
    service: 'Web Design',
    year: '2024',
    metric: '+250%',
    metricLabel: 'Online enquiries',
    description: 'A complete digital transformation that positioned them as the leading wellness provider in Surrey.',
    href: '/case-studies/surrey-wellness/',
    image: '/images/case-study-1.jpg',
    color: '#C72C5B',
    featured: true,
  },
  {
    id: '02',
    client: 'Guildford Cafe Co',
    service: 'Social Media',
    year: '2024',
    metric: '50K',
    metricLabel: 'New followers',
    description: 'From local favourite to regional sensation through authentic storytelling.',
    href: '/case-studies/guildford-cafe-co/',
    image: '/images/case-study-2.jpg',
    color: '#0F0F0F',
    featured: false,
  },
  {
    id: '03',
    client: 'TechStart UK',
    service: 'Video Production',
    year: '2023',
    metric: '1.2M',
    metricLabel: 'Video views',
    description: 'A brand film that helped secure £2M in funding and national recognition.',
    href: '/case-studies/techstart-uk/',
    image: '/images/case-study-3.jpg',
    color: '#C72C5B',
    featured: false,
  },
];

export function CaseStudies() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const activeStudy = caseStudies[activeIndex];

  return (
    <section id="case-studies" ref={containerRef} className="relative bg-white overflow-hidden">

      <div className="relative">
        {/* Header Section */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 pt-24 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
            >
              <div>
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#C72C5B] mb-4"
                >
                  <span className="w-8 h-px bg-[#C72C5B]" />
                  Selected Work
                </motion.span>
                <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#0F0F0F] leading-[0.9]">
                  Work That
                  <br />
                  <span className="font-serif italic text-[#C72C5B]">Speaks</span>
                </h2>
              </div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-gray-500 max-w-md lg:text-right"
              >
                Real results for ambitious brands. Each project tells a story of transformation.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Main Showcase Area */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              
              {/* Left: Large Featured Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden group shadow-2xl shadow-black/10"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {/* Image Placeholder */}
                    <div 
                      className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundColor: activeStudy.color }}
                    >
                      {/* Uncomment when images ready */}
                      {/* <Image
                        src={activeStudy.image}
                        alt={activeStudy.client}
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating Badge */}
                <motion.div 
                  className="absolute top-6 left-6 flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="px-4 py-1.5 rounded-full bg-white text-[#0F0F0F] text-xs font-bold shadow-lg">
                    {activeStudy.service}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                    {activeStudy.year}
                  </span>
                </motion.div>

                {/* View Button */}
                <Link href={activeStudy.href}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.8 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl">
                      <ArrowUpRight className="w-8 h-8 text-[#0F0F0F]" />
                    </div>
                  </motion.div>
                </Link>

                {/* Bottom Info */}
                <div className="absolute bottom-6 left-6 right-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {activeStudy.client}
                      </h3>
                      <p className="text-white/80 text-sm max-w-sm">
                        {activeStudy.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Right: Case Study List */}
              <div className="flex flex-col justify-center">
                <div className="space-y-2">
                  {caseStudies.map((study, index) => (
                    <motion.div
                      key={study.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    >
                      <button
                        onClick={() => setActiveIndex(index)}
                        className={`w-full text-left p-6 rounded-2xl transition-all duration-300 group ${
                          activeIndex === index 
                            ? 'bg-gray-50 border border-gray-100' 
                            : 'bg-transparent hover:bg-gray-50/50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span className={`text-sm font-mono transition-colors ${
                              activeIndex === index ? 'text-[#C72C5B]' : 'text-gray-300'
                            }`}>
                              {study.id}
                            </span>
                            <div>
                              <h4 className={`text-xl font-bold transition-colors ${
                                activeIndex === index ? 'text-[#0F0F0F]' : 'text-gray-400'
                              }`}>
                                {study.client}
                              </h4>
                              <p className="text-sm text-gray-400">{study.service}</p>
                            </div>
                          </div>
                          
                          {/* Metric */}
                          <div className={`text-right transition-all ${
                            activeIndex === index ? 'opacity-100' : 'opacity-0'
                          }`}>
                            <span className="block text-3xl font-bold text-[#C72C5B]">
                              {study.metric}
                            </span>
                            <span className="text-xs text-gray-400">{study.metricLabel}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 h-0.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-[#C72C5B]"
                            initial={{ width: 0 }}
                            animate={{ width: activeIndex === index ? '100%' : '0%' }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                  className="mt-8 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {caseStudies.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          activeIndex === index 
                            ? 'w-8 bg-[#C72C5B]' 
                            : 'w-2 bg-gray-200 hover:bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <Link 
                    href={activeStudy.href}
                    className="flex items-center gap-2 text-[#0F0F0F] hover:text-[#C72C5B] transition-colors group"
                  >
                    <span className="text-sm font-medium">View Case Study</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marquee */}
        <div className="py-12 border-t border-gray-100 overflow-hidden">
          <motion.div 
            className="flex whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ 
              repeat: Infinity, 
              duration: 20, 
              ease: "linear" 
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 mx-8">
                <span className="text-6xl md:text-8xl font-bold text-black">WORK</span>
                <span className="w-4 h-4 rounded-full bg-[#C72C5B]" />
                <span className="text-6xl md:text-8xl font-serif italic text-black">Speaks</span>
                <span className="w-4 h-4 rounded-full bg-black" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/services/"
              className="inline-flex items-center gap-3 rounded-full bg-[#0F0F0F] px-8 py-4 text-base font-bold text-white transition-all hover:bg-[#C72C5B] group"
            >
              Explore All Services
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-3 rounded-full border-2 border-gray-200 px-8 py-4 text-base font-bold text-[#0F0F0F] transition-all hover:border-[#0F0F0F] hover:bg-[#0F0F0F] hover:text-white"
            >
              Start Your Project
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
