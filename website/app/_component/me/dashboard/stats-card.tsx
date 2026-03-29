'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'pink' | 'purple' | 'blue' | 'green';
  delay?: number;
}

const colorVariants = {
  pink: 'from-[#C72C5B] to-[#8B1C3F] shadow-[#C72C5B]/30',
  purple: 'from-purple-600 to-purple-900 shadow-purple-500/30',
  blue: 'from-blue-600 to-blue-900 shadow-blue-500/30',
  green: 'from-emerald-600 to-emerald-900 shadow-emerald-500/30',
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  color,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorVariants[color]} p-6 text-white shadow-lg`}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <motion.h3
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="mt-2 text-4xl font-bold"
            >
              {value}
            </motion.h3>
          </div>
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.1 }}
            className="rounded-xl bg-white/20 p-3 backdrop-blur-sm"
          >
            <Icon className="h-6 w-6" />
          </motion.div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                trend === 'up'
                  ? 'bg-green-400/20 text-green-100'
                  : trend === 'down'
                  ? 'bg-red-400/20 text-red-100'
                  : 'bg-white/20 text-white'
              }`}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'} {trendValue}
            </span>
          )}
          <p className="text-sm text-white/70">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
