'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, Star, Zap, Shield } from 'lucide-react';

const stats = [
  { icon: GraduationCap, value: '200+', label: 'Graduates Photographed' },
  { icon: Star, value: '5.0', label: 'Average Rating' },
  { icon: Zap, value: '48h', label: 'Guaranteed Delivery' },
  { icon: Shield, value: '100%', label: 'Satisfaction Guaranteed' },
];

export default function CinematographyTrust() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="bg-[#111111] py-12 border-y border-white/5">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C72C5B]/10">
                <Icon className="h-5 w-5 text-[#C72C5B]" />
              </div>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-white/50 font-medium uppercase tracking-wider">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
