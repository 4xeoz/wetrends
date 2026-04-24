import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

function detectDevice(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const qrLink = await prisma.qrLink.findUnique({ where: { code } });

  if (!qrLink) {
    return new NextResponse('Not found', { status: 404 });
  }

  const ua = request.headers.get('user-agent') ?? undefined;
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    undefined;
  const country = request.headers.get('x-vercel-ip-country') ?? undefined;
  const city = request.headers.get('x-vercel-ip-city') ?? undefined;
  const referer = request.headers.get('referer') ?? undefined;
  const device = ua ? detectDevice(ua) : undefined;

  // Fire-and-forget — don't block redirect
  prisma.qrScan
    .create({
      data: {
        qrLinkId: qrLink.id,
        userAgent: ua,
        ip,
        country,
        city,
        device,
        referer,
      },
    })
    .catch(() => {});

  return NextResponse.redirect(qrLink.destination, { status: 302 });
}
