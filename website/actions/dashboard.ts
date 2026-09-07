'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';

export type DashboardMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type DashboardLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  duration: string;
  media: string;
  status: string;
  createdAt: string;
};

export type DashboardJob = {
  id: string;
  eventTitle: string;
  eventType: string;
  clientName: string;
  status: string;
  eventDate: string | null;
  galleryStatus: string | null;
  galleryAssetCount: number;
  latestOrder: {
    type: string;
    status: string;
    total: number;
    currency: string;
  } | null;
  createdAt: string;
};

export type DashboardOrder = {
  id: string;
  eventJobId: string;
  eventTitle: string;
  type: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
};

export type DashboardOverview = {
  metrics: {
    newLeads: number;
    activeJobs: number;
    galleriesReady: number;
    printQueue: number;
    unreadMessages: number;
    collected: number;
  };
  messages: DashboardMessage[];
  leads: DashboardLead[];
  jobs: DashboardJob[];
  orders: DashboardOrder[];
};

export type DashboardResponse =
  | { success: true; overview: DashboardOverview }
  | { success: false; message: string };

function iso(value: Date) {
  return value.toISOString();
}

function nullableIso(value: Date | null) {
  return value ? value.toISOString() : null;
}

export async function getDashboardOverview(): Promise<DashboardResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: 'Unauthorized' };

  try {
    const [messages, leads, jobs, orders, newLeads, activeJobs, galleriesReady, printQueue, unreadMessages, revenue] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.eventLead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
      }),
      prisma.eventJob.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          gallery: { select: { status: true, _count: { select: { assets: true } } } },
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { type: true, status: true, total: true, currency: true },
          },
        },
      }),
      prisma.eventOrder.findMany({
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { eventJob: { select: { id: true, eventTitle: true } } },
      }),
      prisma.eventLead.count({ where: { status: 'NEW' } }),
      prisma.eventJob.count({ where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } } }),
      prisma.eventGallery.count({ where: { status: 'PUBLISHED' } }),
      prisma.eventOrder.count({ where: { type: 'PRINT', status: 'PROCESSING' } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.eventOrder.aggregate({
        where: { status: { in: ['PAID', 'PROCESSING', 'FULFILLED'] } },
        _sum: { total: true },
      }),
    ]);

    return {
      success: true,
      overview: {
        metrics: {
          newLeads,
          activeJobs,
          galleriesReady,
          printQueue,
          unreadMessages,
          collected: revenue._sum.total || 0,
        },
        messages: messages.map((message) => ({
          id: message.id,
          name: message.name,
          email: message.email,
          message: message.message,
          isRead: message.isRead,
          createdAt: iso(message.createdAt),
        })),
        leads: leads.map((lead) => ({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          eventType: lead.eventType,
          eventDate: iso(lead.eventDate),
          location: lead.location,
          duration: lead.duration,
          media: lead.media,
          status: lead.status,
          createdAt: iso(lead.createdAt),
        })),
        jobs: jobs.map((job) => ({
          id: job.id,
          eventTitle: job.eventTitle,
          eventType: job.eventType,
          clientName: job.clientName,
          status: job.status,
          eventDate: nullableIso(job.eventDate),
          galleryStatus: job.gallery?.status || null,
          galleryAssetCount: job.gallery?._count.assets || 0,
          latestOrder: job.orders[0] ? {
            type: job.orders[0].type,
            status: job.orders[0].status,
            total: job.orders[0].total,
            currency: job.orders[0].currency,
          } : null,
          createdAt: iso(job.createdAt),
        })),
        orders: orders.map((order) => ({
          id: order.id,
          eventJobId: order.eventJob.id,
          eventTitle: order.eventJob.eventTitle,
          type: order.type,
          status: order.status,
          total: order.total,
          currency: order.currency,
          createdAt: iso(order.createdAt),
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return { success: false, message: 'The dashboard could not be loaded.' };
  }
}
