'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

/**
 * Animates the numeric part of a metric string ("+180%", "4.9★", "-45%", "3×")
 * counting up when it scrolls into view, while preserving the prefix, suffix,
 * and decimal precision. Non-numeric strings render verbatim.
 */
export default function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    // Parse inside the effect so its identity never lands in the dep array —
    // otherwise each rAF-driven re-render would restart the animation.
    const match = value.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
    if (!match || !inView) return;

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo for a confident, decelerating count
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
