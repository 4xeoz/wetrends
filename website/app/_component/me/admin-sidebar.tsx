'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Ticket,
  MessageSquare,
  Settings,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/me/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        label: 'Blog Posts',
        href: '/me/blog',
        icon: <FileText className="h-5 w-5" />,
        badge: 0,
      },
      {
        label: 'Categories',
        href: '/me/blog/categories',
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Promotions',
    items: [
      {
        label: 'Vouchers',
        href: '/me/vouchers',
        icon: <Ticket className="h-5 w-5" />,
      },
      {
        label: 'Scan Voucher',
        href: '/voucher/scan',
        icon: <Ticket className="h-5 w-5" />,
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      {
        label: 'Messages',
        href: '/me/messages',
        icon: <MessageSquare className="h-5 w-5" />,
        badge: 2,
      },
    ],
  },
  {
    title: 'Configuration',
    items: [
      {
        label: 'Settings',
        href: '/me/settings',
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

interface SidebarNavProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
}

function NavLink({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`group relative flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
        isActive
          ? 'bg-[#C72C5B] text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="transition-transform group-hover:scale-110">
          {item.icon}
        </span>
        <span>{item.label}</span>
      </div>
      {item.badge !== undefined && item.badge > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function NavSection({
  section,
  pathname,
}: {
  section: NavSection;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div key={section.title} className="space-y-2">
      <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {section.title}
      </h3>
      <div className="space-y-1">
        {section.items.map((item) => {
          const isActive = pathname === item.href;
          return <NavLink key={item.href} item={item} isActive={isActive} />;
        })}
      </div>
    </div>
  );
}

export function AdminSidebar({ user }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/me/dashboard"
          className="group grid grid-cols-[32px_1fr] items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-900"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C72C5B] to-[#A3244A] font-bold text-white">
            W
          </div>
          <div className="truncate group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              WeTrends
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin</p>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 py-4">
        <nav className="space-y-4">
          {navSections.map((section) => (
            <NavSection key={section.title} section={section} pathname={pathname} />
          ))}
        </nav>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-3">
        {user ? (
          <NavUser
            user={user}
          />
        ) : (
          <div className="rounded-lg bg-slate-100 p-3 text-center text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            Loading...
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
