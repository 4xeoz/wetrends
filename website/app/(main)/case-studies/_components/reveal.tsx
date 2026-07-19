'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * A single, declarative scroll-reveal primitive built on framer-motion's
 * whileInView. Everything on the case-study pages animates through this so the
 * motion language stays consistent and decoupled from GSAP.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
