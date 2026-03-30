'use client';

import { motion } from 'motion/react';
import { Mail, BookOpen, Ticket, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from './stats-card';
import { ActivityChart } from './activity-chart';
import { QuickActions } from './quick-actions';
import Link from 'next/link';

interface DashboardStats {
  messages: { total: number; unread: number };
  blog: { total: number; published: number };
  vouchers: {
    total: number;
    active: number;
    totalValue: number;
    totalSpent: number;
    totalRemaining: number;
  };
  actors: { total: number };
  activityData: { day: string; value: number }[];
  recentMessages: {
    id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }[];
}

interface DashboardContentProps {
  stats: DashboardStats;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardContent({ stats, isLoading, onRefresh }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Button
          onClick={onRefresh}
          variant="outline"
          disabled={isLoading}
          className="w-fit gap-2 rounded-full border-gray-300"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Messages"
          value={stats.messages.total}
          description={`${stats.messages.unread} unread`}
          icon={Mail}
          color="pink"
          trend={stats.messages.unread > 0 ? 'up' : 'neutral'}
          trendValue={stats.messages.unread > 0 ? `${stats.messages.unread} new` : 'all read'}
          delay={0}
        />
        <StatsCard
          title="Blog Posts"
          value={stats.blog.total}
          description={`${stats.blog.published} published`}
          icon={BookOpen}
          color="blue"
          trend="neutral"
          trendValue={`${stats.blog.total - stats.blog.published} drafts`}
          delay={0.1}
        />
        <StatsCard
          title="Vouchers"
          value={stats.vouchers.total}
          description={`${stats.vouchers.active} active`}
          icon={Ticket}
          color="purple"
          trend="neutral"
          trendValue={`£${stats.vouchers.totalRemaining.toFixed(0)} left`}
          delay={0.2}
        />
        <StatsCard
          title="Actors"
          value={stats.actors.total}
          description="Total registered"
          icon={Users}
          color="green"
          trend="neutral"
          trendValue=""
          delay={0.3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Activity & Actions */}
        <div className="space-y-8 lg:col-span-1">
          <ActivityChart data={stats.activityData} />
          <QuickActions />
        </div>

        {/* Right Column - Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Messages</h3>
              <Link href="/me/messages">
                <Button variant="ghost" size="sm" className="text-[#C72C5B]">
                  View All
                </Button>
              </Link>
            </div>

            {stats.recentMessages.length > 0 ? (
              <div className="space-y-4">
                {stats.recentMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:border-[#C72C5B]/20 hover:bg-[#C72C5B]/5"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          message.isRead
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-[#C72C5B]/10 text-[#C72C5B]'
                        }`}
                      >
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{message.name}</p>
                        <p className="text-sm text-gray-500">{message.email}</p>
                        <p className="mt-1 line-clamp-1 text-sm text-gray-600">
                          {message.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          message.isRead
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-[#C72C5B]/10 text-[#C72C5B]'
                        }`}
                      >
                        {message.isRead ? 'Read' : 'New'}
                      </span>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12">
                <Mail className="h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No messages yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-10 text-center text-sm text-gray-400"
      >
        <p>© {new Date().getFullYear()} WeTrends. All rights reserved.</p>
      </motion.div>
    </div>
  );
}
