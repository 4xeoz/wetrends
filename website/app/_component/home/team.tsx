'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import AnimatedContent from '@/components/ui/animated-content';
import { teamMembers } from '@/lib/team-data';

const team = teamMembers;

export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStartX.current = e.pageX - el.offsetLeft;
    scrollStartX.current = el.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = trackRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartX.current) * 1.3;
    el.scrollLeft = scrollStartX.current - walk;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleMouseLeave = useCallback(() => setIsDragging(false), []);

  const renderCard = (member: typeof team[0], index: number, isMobile: boolean) => (
    <Link href={`/who/${member.id}/`} className="group block" draggable={false}>
      <motion.div
        whileHover={{ y: isMobile ? 0 : -8 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow duration-300 group-hover:border-[#C72C5B] group-hover:shadow-xl"
      >
        {/* Image container */}
        <div className={`relative w-full overflow-hidden ${isMobile ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top transition-all duration-500 group-hover:scale-105 group-hover:brightness-105"
            sizes={isMobile ? '45vw' : '25vw'}
            priority={index <= 3}
            draggable={false}
          />

          {/* Giant watermark number */}
          <span className="absolute -left-2 top-2 text-6xl font-black leading-none text-white/30 mix-blend-overlay md:text-8xl">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Hover tint overlay */}
          <div className="absolute inset-0 bg-[#C72C5B]/0 transition-colors duration-300 group-hover:bg-[#C72C5B]/10" />
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white p-3 transition-colors duration-300 group-hover:bg-gray-50 md:p-4">
          <div>
            <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-widest text-[#C72C5B]">
              {member.role}
            </span>
            <h3 className="text-sm font-bold text-[#0F0F0F] md:text-base lg:text-lg">
              {member.name}
            </h3>
          </div>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 text-[#0F0F0F] transition-all duration-300 group-hover:border-[#C72C5B] group-hover:bg-[#C72C5B] group-hover:text-white md:h-10 md:w-10">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45 md:h-4 md:w-4" />
          </div>
        </div>
      </motion.div>
    </Link>
  );

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative overflow-hidden bg-white py-24 md:py-32"
    >
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[#C72C5B]/5 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 grid gap-10 md:mb-24 lg:grid-cols-2 lg:items-end">
          <AnimatedContent direction="vertical" distance={60} duration={1} ease="power3.out">
            <div>
              <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[#C72C5B]">
                The Collective
              </span>
              <h2 className="text-5xl font-bold leading-none text-[#0F0F0F] md:text-6xl lg:text-7xl xl:text-8xl">
                Meet The
                <br />
                <span className="font-serif italic text-[#C72C5B]">Squad</span>
              </h2>
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" distance={60} duration={1} delay={0.2} ease="power3.out">
            <p className="max-w-md text-xl text-gray-600 lg:ml-auto">
              A tight-knit crew of strategists, makers, and storytellers building brands that refuse to be ignored.
            </p>
          </AnimatedContent>
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden grid-cols-4 gap-5 md:grid">
          {team.map((member, index) => (
            <AnimatedContent
              key={member.id}
              direction="vertical"
              distance={40}
              duration={0.6}
              delay={0.08 * (index % 4)}
              ease="power3.out"
            >
              {renderCard(member, index, false)}
            </AnimatedContent>
          ))}
        </div>

        {/* Mobile: Horizontal drag scroll — much shorter section */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={`flex gap-4 overflow-x-auto pb-4 pt-2 md:hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              className="w-[45vw] max-w-[190px] flex-shrink-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              {renderCard(member, index, true)}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <AnimatedContent
          direction="vertical"
          distance={60}
          duration={1}
          delay={0.2}
          ease="power3.out"
          className="mt-20"
        >
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-gray-200 bg-white p-8 md:flex-row md:p-12">
            <div>
              <h4 className="text-2xl font-bold text-[#0F0F0F] md:text-3xl">
                Want in?
              </h4>
              <p className="mt-1 text-gray-600">
                We&apos;re always scouting for fearless creatives.
              </p>
            </div>
            <motion.a
              href="/#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-8 py-4 font-bold text-white transition-colors hover:bg-[#A3244A]"
            >
              Join the Squad
              <ArrowUpRight className="h-5 w-5" />
            </motion.a>
          </div>
        </AnimatedContent>
      </div>

      <style jsx global>{`
        .cursor-grab { cursor: grab; }
        .cursor-grabbing { cursor: grabbing; }
      `}</style>
    </section>
  );
}
