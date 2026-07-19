'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/** A thin reading-progress bar pinned to the top of a case-study story. */
export default function ScrollProgress({ color }: { color: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left"
      style={{ scaleX, backgroundColor: color }}
    />
  );
}
