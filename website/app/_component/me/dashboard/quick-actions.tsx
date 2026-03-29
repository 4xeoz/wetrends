'use client';

import { motion } from 'motion/react';
import { FileText, Users, Settings, Mail, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    title: 'Blog Posts',
    description: 'Manage articles',
    icon: FileText,
    href: '/me/blogs',
    color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
  },
  {
    title: 'Team Members',
    description: 'View team',
    icon: Users,
    href: '/me/team',
    color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
  },
  {
    title: 'Messages',
    description: 'View inbox',
    icon: Mail,
    href: '/me/dashboard',
    color: 'bg-[#C72C5B]/10 text-[#C72C5B] hover:bg-[#C72C5B]/20',
  },
  {
    title: 'Settings',
    description: 'Configure',
    icon: Settings,
    href: '/me/settings',
    color: 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20',
  },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link
              href={action.href}
              className={`group flex flex-col items-start gap-3 rounded-xl p-4 transition-all ${action.color}`}
            >
              <div className="flex w-full items-center justify-between">
                <action.icon className="h-6 w-6" />
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div>
                <p className="font-semibold">{action.title}</p>
                <p className="text-sm opacity-70">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
