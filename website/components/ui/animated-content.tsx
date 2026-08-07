'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Scroll-reveal wrapper: fades and slides its children in the first time they
 * enter the viewport. Built on Motion's `whileInView` so each instance owns its
 * own observer — no global animation registry to leak or tear down.
 */
export default function AnimatedContent({
  children,
  distance = 100,
  direction = 'vertical',
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  className,
}: {
  children: ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  duration?: number;
  delay?: number;
  /** Fraction of the element that must be visible before it animates. */
  threshold?: number;
  className?: string;
}) {
  const axis = direction === 'horizontal' ? 'x' : 'y';

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, [axis]: distance }}
      whileInView={{ opacity: 1, [axis]: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
