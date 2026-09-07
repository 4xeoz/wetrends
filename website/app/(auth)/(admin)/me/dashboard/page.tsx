'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { getDashboardOverview, type DashboardOverview } from '@/actions/dashboard';
import { DashboardContent } from '@/app/_component/me/dashboard/dashboard-content';

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDashboard() {
    setIsLoading(true);
    try {
      const response = await getDashboardOverview();
      if (response.success) {
        setOverview(response.overview);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch {
      setError('An unexpected error occurred while loading the dashboard.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void fetchDashboard();
  }, []);

  if (isLoading && !overview) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[#F7F4F2]">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="wt-page-loader" aria-hidden="true"><span /></span>
          <p className="text-sm font-semibold text-black/50">Loading your workspace…</p>
        </motion.div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-[#F7F4F2] p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-[0_24px_80px_rgba(58,24,36,0.1)]"
        >
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#FFF0F4] text-[#C72C5B]"><AlertTriangle className="h-5 w-5" /></span>
          <h1 className="mt-5 text-2xl font-bold tracking-[-0.04em]">Workspace unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-black/50">{error || 'We could not load your event overview.'}</p>
          <button type="button" onClick={() => { void fetchDashboard(); }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C72C5B] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#A3244A]"><RefreshCw className="h-4 w-4" /> Try again</button>
        </motion.div>
      </div>
    );
  }

  return <DashboardContent overview={overview} isLoading={isLoading} onRefresh={fetchDashboard} error={error} />;
}
