import { auth } from '@/lib/auth';
import { ensureEventDriveFolders, uploadGoogleDriveFile } from '@/lib/google-drive';
import { prisma } from '@/prisma/prisma';

export const runtime = 'nodejs';

const MAX_IMAGE_BYTES = 50 * 1024 * 1024;

function safeFileName(value: string) {
  return value.replace(/[\\/\u0000-\u001f\u007f]+/g, '-').trim().slice(0, 180) || 'event-photograph';
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'The upload form could not be read.' }, { status: 400 });
  }

  const eventJobId = String(formData.get('eventJobId') || '');
  const file = formData.get('file');
  if (!/^[a-f\d]{24}$/i.test(eventJobId) || !(file instanceof File)) {
    return Response.json({ error: 'Invalid event upload.' }, { status: 400 });
  }
  if (!file.type.startsWith('image/')) return Response.json({ error: 'Only image files can be uploaded.' }, { status: 415 });
  if (file.size < 1 || file.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: 'Images must be smaller than 50 MB.' }, { status: 413 });
  }

  const job = await prisma.eventJob.findUnique({
    where: { id: eventJobId },
    include: { gallery: { include: { _count: { select: { assets: true } } } } },
  });
  if (!job?.gallery) return Response.json({ error: 'Event gallery not found.' }, { status: 404 });

  try {
    const folders = await ensureEventDriveFolders({
      eventJobId: job.id,
      eventTitle: job.eventTitle,
      existingFolderId: job.driveFolderId,
    });
    if (!job.driveFolderId) {
      await prisma.eventJob.update({ where: { id: job.id }, data: { driveFolderId: folders.eventFolderId } });
    }

    const uploaded = await uploadGoogleDriveFile({
      name: safeFileName(file.name),
      mimeType: file.type,
      parentId: folders.editedGalleryFolderId,
      body: Buffer.from(await file.arrayBuffer()),
    });
    const asset = await prisma.galleryAsset.create({
      data: {
        galleryId: job.gallery.id,
        title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || `Event photograph ${job.gallery._count.assets + 1}`,
        alt: `${job.eventTitle} photograph`,
        provider: 'google-drive',
        driveFileId: uploaded.id,
        driveMimeType: uploaded.mimeType || file.type,
        driveName: uploaded.name || safeFileName(file.name),
        sortOrder: job.gallery._count.assets,
      },
    });

    return Response.json({
      success: true,
      assetId: asset.id,
      name: uploaded.name || file.name,
      provider: 'google-drive',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Google Drive upload failed.';
    return Response.json({ error: message }, { status: 503 });
  }
}
