'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/actions/dashboard';
import { DashboardContent } from '@/app/_component/me/dashboard/dashboard-content';
import { motion } from 'motion/react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>>['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await getDashboardStats();
      if (response.success && response.stats) {
        setStats(response.stats);
        setError(null);
      } else {
        setError(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#C72C5B]/20 border-t-[#C72C5B]" />
            <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-[#C72C5B]/10" />
          </div>
          <p className="text-lg font-medium text-gray-600">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Something went wrong</h3>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={fetchStats}
            className="rounded-full bg-[#C72C5B] px-6 py-2 font-medium text-white transition-all hover:bg-[#A3244A] hover:shadow-lg"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return <DashboardContent stats={stats!} isLoading={isLoading} onRefresh={fetchStats} />;
}
