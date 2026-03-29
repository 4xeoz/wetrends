'use client';

import { motion } from 'motion/react';
import { Mail, Users, Eye, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from './stats-card';
import { ActivityChart } from './activity-chart';
import { QuickActions } from './quick-actions';
import { Message } from './message-list';

interface DashboardContentProps {
  messages: Message[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardContent({ messages, isLoading, onRefresh }: DashboardContentProps) {
  // Calculate stats
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;
  const readMessages = messages.filter((m) => m.isRead).length;

  // Mock activity data (in real app, calculate from actual message dates)
  const activityData = [
    { day: 'Mon', value: 3 },
    { day: 'Tue', value: 5 },
    { day: 'Wed', value: 2 },
    { day: 'Thu', value: 8 },
    { day: 'Fri', value: 6 },
    { day: 'Sat', value: 4 },
    { day: 'Sun', value: 3 },
  ];

  // Recent messages preview (last 3)
  const recentMessages = messages.slice(0, 3);

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
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard
          </h1>
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
          title="Total Messages"
          value={totalMessages}
          description="All time messages"
          icon={Mail}
          color="pink"
          trend="up"
          trendValue="12%"
          delay={0}
        />
        <StatsCard
          title="Unread"
          value={unreadMessages}
          description="Need attention"
          icon={Mail}
          color="purple"
          trend={unreadMessages > 0 ? 'up' : 'neutral'}
          trendValue={unreadMessages > 0 ? 'New' : '0'}
          delay={0.1}
        />
        <StatsCard
          title="Read"
          value={readMessages}
          description="Processed messages"
          icon={Eye}
          color="blue"
          trend="up"
          trendValue="85%"
          delay={0.2}
        />
        <StatsCard
          title="Visitors"
          value="1.2K"
          description="This month"
          icon={Users}
          color="green"
          trend="up"
          trendValue="23%"
          delay={0.3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Activity & Actions */}
        <div className="space-y-8 lg:col-span-1">
          <ActivityChart data={activityData} />
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
              <Button variant="ghost" size="sm" className="text-[#C72C5B]">
                View All
              </Button>
            </div>

            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
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
        <p>© 2024 WeTrends. All rights reserved.</p>
      </motion.div>
    </div>
  );
}
