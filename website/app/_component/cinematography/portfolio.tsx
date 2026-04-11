'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

// Unsplash graduation / portrait photography images
const portfolioImages = [
  {
    src: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80',
    alt: 'Graduation portrait at Surrey University',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
    alt: 'Graduate celebrating at Guildford ceremony',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
    alt: 'Graduation cap thrown in the air',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600&q=80',
    alt: 'Student portrait graduation day Surrey',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1604004215402-a637698cf7e9?w=600&q=80',
    alt: 'Cinematic graduation shoot outdoors Guildford',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?w=600&q=80',
    alt: 'Graduate holding diploma University of Surrey',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
    alt: 'Group of graduates University of Surrey Guildford',
    span: 'col-span-2',
  },
];

export default function CinematographyPortfolio() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      id="work"
      ref={ref}
      className="bg-[#111111] py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C72C5B]">
            Our Work
          </p>
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Every Moment, Cinematic
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-white/50">
            From the ceremony halls to the grounds of Guildford, we turn your
            graduation day into a timeless visual story.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3 lg:auto-rows-[240px]">
          {portfolioImages.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl bg-zinc-900 ${img.span}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-center text-sm text-white/30"
        >
          Sample portfolio images — your photos will be tailored to your graduation day
        </motion.p>
      </div>
    </section>
  );
}
