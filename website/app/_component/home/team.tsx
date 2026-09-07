'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';

export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative overflow-hidden bg-[#C72C5B]"
    >
      {/* Large background numbers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute -top-20 -left-10 text-[20rem] md:text-[30rem] font-black text-white/5 leading-none">
          08
        </span>
        <span className="absolute -bottom-40 -right-20 text-[15rem] md:text-[25rem] font-black text-white/5 leading-none">
          TM
        </span>
      </div>

      {/* Main section with image and content - Full screen */}
      <div className="relative grid lg:grid-cols-2 min-h-screen">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={isInView ? { opacity: 1, clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[50vh] lg:h-auto"
        >
          <Image
            src="/images/team-photo.jpg"
            alt="The WeTrends Squad"
            fill
            className="object-cover object-center grayscale contrast-125"
            sizes="50vw"
            priority
          />
        </motion.div>

        {/* Right: Content */}
        <div className="relative flex flex-col justify-center p-8 lg:p-16">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-white text-[#C72C5B] text-xs font-bold uppercase tracking-widest">
              The Collective
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              meet
              the
              <br />
              <span className="font-serif italic font-thin" style={{ WebkitTextStroke: '2px white' }}>
                Squad
              </span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-white/80 max-w-md mb-10"
          >
            A multidisciplinary team bringing strategy, design, production and content together around one clear brief.
          </motion.p>

          {/* Disciplines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex flex-wrap gap-3"
          >
            {['Strategy', 'Design', 'Production', 'Content'].map((discipline) => (
              <span key={discipline} className="rounded-full border border-white/25 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white/85">
                {discipline}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
