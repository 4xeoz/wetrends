'use client';

import { motion } from 'motion/react';

interface ActivityData {
  day: string;
  value: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Weekly Activity</h3>
      <div className="flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative w-full max-w-[40px] cursor-pointer overflow-hidden rounded-t-lg bg-gradient-to-t from-[#C72C5B] to-[#E85D8A]"
            >
              {/* Hover effect overlay */}
              <motion.div
                className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity"
                whileHover={{ opacity: 1 }}
              />
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {item.value} messages
              </div>
            </motion.div>
            <span className="text-xs font-medium text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
