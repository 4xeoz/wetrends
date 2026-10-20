'use client';

import { useEffect, useRef, useState } from 'react';

type ViewportVideoProps = {
  src: string;
  active?: boolean;
  className?: string;
};

/** Mount the MP4 only when its card is actually on screen. */
export default function ViewportVideo({ src, active = true, className = '' }: ViewportVideoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.intersectionRatio >= 0.55),
      { threshold: [0, 0.55] },
    );
    observer.observe(node);

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setMotionAllowed(!motionPreference.matches);
    const updatePageVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updatePageVisibility();
    motionPreference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updatePageVisibility);
    return () => {
      observer.disconnect();
      motionPreference.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updatePageVisibility);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 bg-cover bg-center ${className}`}
      style={{ backgroundImage: "url('/images/hero_background.webp')" }}
      aria-hidden="true"
    >
      {active && visible && pageVisible && motionAllowed && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
