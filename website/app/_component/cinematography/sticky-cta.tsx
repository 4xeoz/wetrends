'use client';

import { useEffect, useState } from 'react';

export default function CinematographyStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling past ~80vh (past the hero)
    const threshold = window.innerHeight * 0.8;

    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 inset-x-0 z-40 transform transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 shadow-2xl">
        <div>
          <p className="text-xs font-black text-gray-900">
            Graduation Photography
          </p>
          <p className="text-[11px] text-gray-500">From £35 · 48h delivery</p>
        </div>
        <a
          href="#book"
          className="flex-shrink-0 rounded-full bg-[#C72C5B] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#C72C5B]/25 transition-colors hover:bg-[#a8244d]"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}
