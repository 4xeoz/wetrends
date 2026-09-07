import { createHmac } from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const recipient = process.env.EVENT_TEST_EMAIL;
const secret = process.env.EVENT_LINK_SECRET;
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

if (!recipient || !secret || secret.length < 32) {
  throw new Error('EVENT_TEST_EMAIL and a 32+ character EVENT_LINK_SECRET are required');
}

function tokenFor(job) {
  const encoded = Buffer.from(`${job.id}.${job.accessVersion}`, 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

const galleryImages = [
  ['Arrival', '/images/events-birthday.png', 'Guests arriving at a birthday celebration'],
  ['The toast', '/images/events-celebration-toast.png', 'Friends raising glasses together'],
  ['On the dance floor', '/images/events-celebration-dance.png', 'Guests dancing at the celebration'],
  ['The celebration', '/images/events-celebration.png', 'A lively celebration photographed by WeTrends'],
  ['A proud moment', '/images/events-awards.png', 'An award moment on stage'],
  ['Together', '/images/events-anniversary.png', 'Guests sharing an anniversary moment'],
  ['The speech', '/images/events-speaker.png', 'A speaker addressing event guests'],
  ['The room', '/images/events-corporate.png', 'Guests gathered inside the event venue'],
  ['Centre stage', '/images/events-corporate-stage.png', 'A presentation photographed from the audience'],
  ['The award', '/images/events-corporate-award.png', 'An award presented during the event'],
  ['Launch moment', '/images/events-launch.png', 'Guests enjoying a launch celebration'],
  ['The graduate', '/images/events-graduation.png', 'A graduate celebrating their achievement'],
];

async function ensureJob(title, options) {
  let job = await prisma.eventJob.findFirst({ where: { eventTitle: title, clientEmail: recipient } });
  if (!job) {
    job = await prisma.eventJob.create({
      data: {
        clientName: 'Iyad',
        clientEmail: recipient,
        clientPhone: '07123456789',
        eventTitle: title,
        eventType: 'Birthday celebration',
        eventDate: new Date('2026-09-01T18:00:00.000Z'),
        location: 'Guildford, Surrey',
        photographerName: 'Iyad Chirifi',
        photographerImage: '/images/eddy-event-photographer-v2.png',
        partnerName: options.partnerName,
        includedImageCount: 10,
        fullGalleryPrice: 7900,
        retouchingPrice: options.retouchingPrice,
        extraCoverageMinutes: options.extraCoverageMinutes,
        extraCoveragePrice: options.extraCoveragePrice,
        gallery: { create: {} },
      },
    });
  }

  const gallery = await prisma.eventGallery.findUnique({
    where: { eventJobId: job.id },
    include: { _count: { select: { assets: true } } },
  });
  if (!gallery) throw new Error(`Gallery missing for ${title}`);

  if (gallery._count.assets === 0) {
    await prisma.galleryAsset.createMany({
      data: galleryImages.map(([assetTitle, sourceUrl, alt], index) => ({
        galleryId: gallery.id,
        title: assetTitle,
        sourceUrl,
        alt,
        sortOrder: index,
      })),
    });
  }

  return job;
}

try {
  const paid = await ensureJob('Birthday Celebration · Payment Test', {
    partnerName: 'Savanna Venue',
    retouchingPrice: 3500,
    extraCoverageMinutes: 30,
    extraCoveragePrice: 2500,
  });
  const included = await ensureJob('Birthday Celebration · Included Test', {
    partnerName: 'Savanna Venue',
    retouchingPrice: 0,
    extraCoverageMinutes: 0,
    extraCoveragePrice: 0,
  });
  const hosted = process.env.CREATE_HOSTED_E2E === '1'
    ? await ensureJob(`Birthday Celebration · Hosted E2E · ${new Date().toISOString()}`, {
        partnerName: 'Savanna Venue',
        retouchingPrice: 3500,
        extraCoverageMinutes: 30,
        extraCoveragePrice: 2500,
      })
    : null;

  console.log(JSON.stringify({
    paid: `${appUrl}/events/client/${tokenFor(paid)}`,
    included: `${appUrl}/events/client/${tokenFor(included)}`,
    hosted: hosted ? `${appUrl}/events/client/${tokenFor(hosted)}` : undefined,
    admin: `${appUrl}/me/events`,
  }, null, 2));
} finally {
  await prisma.$disconnect();
}
