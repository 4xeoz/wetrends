'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2000; // 2 seconds minimum
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Small delay at 100% before hiding
        setTimeout(() => setIsLoading(false), 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] rounded-full bg-gradient-to-br from-[#C72C5B]/20 via-transparent to-purple-600/20 blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute -bottom-1/4 -right-1/4 h-[150%] w-[150%] rounded-full bg-gradient-to-tl from-blue-600/20 via-transparent to-[#C72C5B]/20 blur-3xl"
              />
            </div>

            {/* Logo Animation */}
            <div className="relative mb-12">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Outer ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 rounded-full border border-[#C72C5B]/30"
                  style={{ borderStyle: 'dashed' }}
                />
                
                {/* Inner ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-8 rounded-full border border-white/10"
                />

                {/* Logo Text */}
                <h1 className="relative bg-gradient-to-r from-white via-[#C72C5B] to-white bg-clip-text text-6xl font-bold text-transparent md:text-8xl">
                  W
                </h1>
              </motion.div>
            </div>

            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 text-center"
            >
              <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                WETRENDS
              </h2>
              <p className="text-sm tracking-[0.3em] text-white/50 uppercase">
                Creative Agency
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-64 md:w-80">
              <div className="mb-2 flex justify-between text-xs text-white/50">
                <span>Loading</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#C72C5B] to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Tips */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-xs text-white/30"
            >
              Crafting digital experiences...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}
