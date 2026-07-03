'use server';

import { prisma } from '@/prisma/prisma';
import { z } from 'zod';

const createSchema = z.object({
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Code must be lowercase letters, numbers, and hyphens only'),
  label: z.string().min(1, 'Label is required').max(100),
  destination: z.string().url('Must be a valid URL'),
});

export type CreateQrInput = z.infer<typeof createSchema>;

export async function createQrLink(data: CreateQrInput) {
  const parsed = createSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message };
  }

  try {
    const existing = await prisma.qrLink.findUnique({ where: { code: parsed.data.code } });
    if (existing) {
      return { success: false, message: 'A QR code with this code already exists.' };
    }

    const qrLink = await prisma.qrLink.create({ data: parsed.data });
    return { success: true, id: qrLink.id, code: qrLink.code };
  } catch {
    return { success: false, message: 'Failed to create QR link.' };
  }
}

export async function getAllQrLinks() {
  return prisma.qrLink.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { scans: true } },
    },
  });
}

export async function getQrLinkWithScans(code: string) {
  return prisma.qrLink.findUnique({
    where: { code },
    include: {
      scans: {
        orderBy: { scannedAt: 'desc' },
        take: 50,
      },
      _count: { select: { scans: true } },
    },
  });
}

export async function deleteQrLink(id: string) {
  try {
    await prisma.qrLink.delete({ where: { id } });
    return { success: true };
  } catch {
    return { success: false, message: 'Failed to delete QR link.' };
  }
}
