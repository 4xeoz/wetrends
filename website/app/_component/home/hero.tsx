'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

const Hero = () => {
  const baseDelay = 2.5; // 2.3s + 0.2s offset

  return (
    <section className="relative -mt-[72px] flex h-[100svh] min-h-[600px] w-full flex-col overflow-hidden pt-[72px]">
      {/* Background Image */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: baseDelay - 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/images/hero_background.webp"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

      </motion.div>

      {/* Large background circle */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: baseDelay, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" 
      />

      {/* Main content - centered */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          
          {/* Main Heading with character stagger effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: baseDelay + 0.25 }}
            className="text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            <motion.span
              initial={{ y: 60, opacity: 0, rotateX: -80 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: baseDelay + 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              We build{' '}
            </motion.span>
            <motion.span
              initial={{ y: 60, opacity: 0, rotateX: -80 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: baseDelay + 0.4, ease: [0.22, 1, 0.36, 1] }}
              className=" font-serif italic font-thin"
            >
               {' '}brands
            </motion.span>
            <br />
            <motion.span
              initial={{ y: 60, opacity: 0, rotateX: -80 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.8, delay: baseDelay + 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif italic font-thin"
            >
              that refuse to
            </motion.span>{' '}
            <motion.span
              initial={{ y: 60, opacity: 0, rotateX: -80, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: baseDelay + 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-block relative"
            >
              blend in
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: baseDelay + 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-white/30 origin-left"
              />
            </motion.span>
          </motion.h1>

          {/* Description with blur reveal */}
          <motion.p
            initial={{ opacity: 0, filter: 'blur(10px)', y: 30 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ 
              duration: 0.9, 
              delay: baseDelay + 0.7, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base md:mt-6 md:text-lg"
          >
            Video production, brand identity, web design & social media for ambitious businesses in Guildford, Surrey and beyond.
          </motion.p>

          {/* Buttons with elastic stagger */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: baseDelay + 0.8 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4"
          >
            <motion.div
              initial={{ scale: 0, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: baseDelay + 0.85 
              }}
            >
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#C72C5B] shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl sm:px-7 sm:py-3.5 sm:text-base md:px-8"
              >
                Start Your Project
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C72C5B] text-white transition-transform group-hover:scale-110 group-hover:rotate-45 sm:h-8 sm:w-8">
                  <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </span>
              </Link>
            </motion.div>


          </motion.div>
        </div>
      </div>

      {/* Bottom scroll indicator with floating animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: baseDelay + 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex justify-center pb-6"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            href="#subhero"
            className="flex flex-col items-center gap-1 text-white/60 transition-colors hover:text-white sm:gap-2"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: baseDelay + 1.3 }}
              className="text-[10px] uppercase tracking-widest sm:text-xs"
            >
              Scroll
            </motion.span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: baseDelay + 1.2 
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 sm:h-10 sm:w-10"
            >
              <ArrowDownRight className="h-3.5 w-3.5 rotate-45 sm:h-4 sm:w-4" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
