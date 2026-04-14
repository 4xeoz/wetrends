'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import CardSwap, { Card } from '../../../components/ui/cardSwap';
import { Code, Globe, Video, Palette, Cpu, Zap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    number: '01',
    icon: Code,
    title: 'Software Development',
    description: 'Custom web applications, MVPs, and digital products built to solve real business problems.',
    category: "Software",
    videoSrc: "/videos/design-preview-wetrends.mp4",
    color: "#C72C5B",
  },
  {
    number: '02',
    icon: Globe,
    title: 'Web Design & Development',
    description: 'High-converting websites and e-commerce platforms that drive measurable results.',
    category: "Web",
    videoSrc: "/videos/website-preview-wetrends.mp4",
    color: "#0F0F0F",
  },
  {
    number: '03',
    icon: Video,
    title: 'Video Production',
    description: 'Cinematic storytelling that captivates audiences and drives engagement across all platforms.',
    category: "Video",
    videoSrc: "/videos/video-preview-wetrends.mp4",
    color: "#C72C5B",
  },
  {
    number: '04',
    icon: Palette,
    title: 'Brand Identity',
    description: 'Visual systems that demand attention and create lasting impressions.',
    category: "Branding",
    videoSrc: "/videos/social-preview-wetrends.mp4",
    color: "#0F0F0F",
  },
  {
    number: '05',
    icon: Cpu,
    title: 'Tech Consulting',
    description: 'Strategic technology guidance to streamline operations and accelerate growth.',
    category: "Consulting",
    videoSrc: "/videos/animations-preview-wetrends.mp4",
    color: "#C72C5B",
  },
  {
    number: '06',
    icon: Zap,
    title: 'Animation & Motion',
    description: 'Motion design that brings brands to life with dynamic storytelling.',
    category: "Animation",
    videoSrc: "/videos/design-preview-wetrends.mp4",
    color: "#0F0F0F",
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
              Creative Tech,
              <br />
              <span className="font-serif italic text-[#C72C5B]">Real Solutions</span>
            </h2>
          </motion.div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left - Services List */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-0">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
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
                      <div className="relative py-5 md:py-6">
                        <div className="flex items-center justify-between gap-4">
                          {/* Left: Number + Icon + Title */}
                          <div className="flex items-center gap-4 md:gap-6">
                            {/* Number */}
                            <span className={`text-sm font-mono transition-colors duration-300 min-w-[2rem] ${
                              hoveredIndex === index ? 'text-[#C72C5B]' : 'text-gray-400'
                            }`}>
                              {service.number}
                            </span>

                            {/* Icon */}
                            <div className={`hidden md:flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                              hoveredIndex === index 
                                ? 'bg-[#C72C5B] text-white' 
                                : 'bg-gray-100 text-[#0F0F0F]'
                            }`}>
                              <service.icon className="h-4 w-4" />
                            </div>

                            {/* Title */}
                            <h3 className={`text-lg md:text-2xl font-bold transition-colors duration-300 ${
                              hoveredIndex === index ? 'text-white' : 'text-[#0F0F0F]'
                            }`}>
                              {service.title}
                            </h3>
                          </div>

                          {/* Arrow */}
                          <div className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border transition-all duration-300 ${
                            hoveredIndex === index 
                              ? 'border-[#C72C5B] bg-[#C72C5B] text-white' 
                              : 'border-gray-200 text-gray-400'
                          }`}>
                            <ArrowUpRight className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-transform duration-300 ${
                              hoveredIndex === index ? 'rotate-45' : ''
                            }`} />
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
          </motion.div>

          {/* Right - Video Card Slider with White Background */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Desktop: CardSwap */}
            <div className="hidden lg:block relative h-[480px] xl:h-[540px]">
              <div className="absolute inset-0 overflow-hidden rounded-3xl bg-white border border-gray-200">
                <CardSwap
                  cardDistance={30}
                  verticalDistance={35}
                  delay={3000}
                  skewAmount={0}
                  easing="elastic"
                >
                  {services.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Card key={item.number} className="overflow-hidden">
                        {/* Video Background */}
                        <video
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        >
                          <source src={item.videoSrc} type="video/mp4" />
                        </video>

                        {/* Solid Color Overlay */}
                        <div 
                          className="absolute inset-0 opacity-60" 
                          style={{ backgroundColor: item.color }}
                        />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                          <div className="flex justify-between items-start">
                            <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
                              {item.category}
                            </span>
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                              <IconComponent className="w-5 h-5" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold leading-tight">{item.title}</h3>
                            <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </CardSwap>
              </div>
            </div>

            {/* Mobile/Tablet: Horizontal Scroll Cards */}
            <div className="lg:hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                {services.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div 
                      key={item.number} 
                      className="flex-shrink-0 w-[280px] sm:w-[300px] h-[380px] rounded-2xl overflow-hidden relative snap-start border border-gray-200"
                    >
                      {/* Video Background */}
                      <video
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src={item.videoSrc} type="video/mp4" />
                      </video>

                      {/* Solid Color Overlay */}
                      <div 
                        className="absolute inset-0 opacity-60" 
                        style={{ backgroundColor: item.color }}
                      />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium backdrop-blur-sm">
                            {item.category}
                          </span>
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <IconComponent className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                          <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
