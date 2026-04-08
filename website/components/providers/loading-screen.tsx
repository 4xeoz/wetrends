'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const interval = 16;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const easeOut = 1 - Math.pow(1 - currentStep / steps, 3);
      const newProgress = Math.min(easeOut * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setIsLoading(false), 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Logo */}
            <motion.div
              className="relative mb-16 flex items-center justify-center"
              initial={{ y: 0 }}
              exit={{ y: '-120%' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/logo-transparent.svg"
                alt="WeTrends"
                width={140}
                height={140}
                className="h-20 w-auto md:h-28"
                style={{
                  filter: 'brightness(0) invert(1)',
                }}
                priority
              />
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-[15%] w-48 md:w-56"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="relative h-px overflow-hidden bg-white/20">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
                Loading
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content - always rendered, just hidden during loading */}
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </div>
    </>
  );
}
