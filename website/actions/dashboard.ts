'use server';

import { prisma } from '@/prisma/prisma';
import { auth } from '@/lib/auth/auth';

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, message: 'Unauthorized' };
  }

  try {
    const [
      totalMessages,
      unreadMessages,
      totalPosts,
      publishedPosts,
      totalVouchers,
      activeVouchers,
      totalActors,
      voucherAggregates,
      recentMessages,
    ] = await Promise.all([
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.voucher.count(),
      prisma.voucher.count({ where: { status: 'ACTIVE' } }),
      prisma.actor.count(),
      prisma.voucher.aggregate({
        _sum: { totalAmount: true, spentAmount: true, remainingAmount: true },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          message: true,
          isRead: true,
          createdAt: true,
        },
      }),
    ]);

    // Build last 7 days activity from real message data
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activityData = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const start = new Date();
        start.setDate(start.getDate() - (6 - i));
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        return prisma.contactMessage
          .count({ where: { createdAt: { gte: start, lte: end } } })
          .then((count) => ({ day: days[start.getDay()], value: count }));
      })
    );

    return {
      success: true as const,
      stats: {
        messages: { total: totalMessages, unread: unreadMessages },
        blog: { total: totalPosts, published: publishedPosts },
        vouchers: {
          total: totalVouchers,
          active: activeVouchers,
          totalValue: voucherAggregates._sum.totalAmount ?? 0,
          totalSpent: voucherAggregates._sum.spentAmount ?? 0,
          totalRemaining: voucherAggregates._sum.remainingAmount ?? 0,
        },
        actors: { total: totalActors },
        activityData,
        recentMessages,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false as const, message: 'Failed to fetch dashboard stats' };
  }
}
