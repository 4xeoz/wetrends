import 'server-only';
import { prisma } from '@/prisma/prisma';
import { verifyEventToken } from './access';

export async function getEventJobFromToken(token: string) {
  const parsed = verifyEventToken(token);
  if (!parsed) return null;

  const job = await prisma.eventJob.findUnique({
    where: { id: parsed.eventJobId },
    include: {
      gallery: {
        include: { assets: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] } },
      },
      orders: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!job || job.accessVersion !== parsed.accessVersion || job.status === 'CANCELLED') return null;
  return job;
}

export function visibleGalleryAssets<T>(
  assets: T[],
  selectedPackage: 'INCLUDED' | 'FULL' | null,
  includedImageCount: number,
) {
  return selectedPackage === 'FULL' ? assets : assets.slice(0, includedImageCount);
}
