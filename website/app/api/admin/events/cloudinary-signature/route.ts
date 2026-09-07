import { auth } from '@/lib/auth';
import { getCloudinaryAdmin } from '@/lib/cloudinary-admin';
import { prisma } from '@/prisma/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as { eventJobId?: string } | null;
  const eventJobId = body?.eventJobId;
  if (!eventJobId || !/^[a-f\d]{24}$/i.test(eventJobId)) {
    return Response.json({ error: 'Invalid event job.' }, { status: 400 });
  }

  const job = await prisma.eventJob.findUnique({ where: { id: eventJobId }, select: { id: true } });
  if (!job) return Response.json({ error: 'Event not found.' }, { status: 404 });

  try {
    const { cloudinary, cloudName, apiKey, apiSecret } = getCloudinaryAdmin();
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `wetrends/events/${eventJobId}`;
    const type = 'authenticated';
    const signature = cloudinary.utils.api_sign_request({ folder, timestamp, type }, apiSecret);

    return Response.json({ cloudName, apiKey, timestamp, folder, type, signature });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cloudinary is unavailable.';
    return Response.json({ error: message }, { status: 503 });
  }
}
