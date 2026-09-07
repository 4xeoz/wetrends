import { PrismaClient } from '@prisma/client';
import { createHmac } from 'node:crypto';

const prisma = new PrismaClient();
const recipient = process.env.EVENT_TEST_EMAIL;
const secret = process.env.EVENT_LINK_SECRET;
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

if (!recipient || !secret) throw new Error('EVENT_TEST_EMAIL and EVENT_LINK_SECRET are required');

function tokenFor(job) {
  const encoded = Buffer.from(`${job.id}.${job.accessVersion}`, 'utf8').toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

async function summary(title) {
  const job = await prisma.eventJob.findFirst({
    where: { eventTitle: title, clientEmail: recipient },
    include: {
      gallery: { include: { assets: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }, _count: { select: { assets: true } } } },
      orders: { orderBy: { createdAt: 'asc' } },
      emails: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!job) throw new Error(`Missing test job: ${title}`);
  return {
    id: job.id,
    accessVersion: job.accessVersion,
    title: job.eventTitle,
    status: job.status,
    selectedPackage: job.selectedPackage,
    gallery: job.gallery ? { status: job.gallery.status, assets: job.gallery._count.assets } : null,
    orders: job.orders.map((order) => ({
      type: order.type,
      status: order.status,
      total: order.total,
      stripeSessionStored: Boolean(order.stripeCheckoutSessionId),
      paymentIntentStored: Boolean(order.stripePaymentIntentId),
      shippingAddressStored: Boolean(order.shippingAddress),
    })),
    emails: job.emails.map((email) => ({
      kind: email.kind,
      status: email.status,
      providerIdStored: Boolean(email.providerId),
    })),
    assetIds: job.gallery?.assets.map((asset) => asset.id) || [],
  };
}

try {
  const paid = await summary('Birthday Celebration · Payment Test');
  const included = await summary('Birthday Celebration · Included Test');

  if (paid.selectedPackage !== 'FULL' || !paid.orders.some((order) => order.type === 'DIGITAL' && order.status === 'PAID')) {
    throw new Error('Paid collection was not fulfilled correctly');
  }
  if (!paid.emails.some((email) => email.kind === 'digital-confirmation' && email.status === 'sent')) {
    throw new Error('Paid confirmation email was not accepted by Resend');
  }
  if (included.selectedPackage !== 'INCLUDED' || !included.orders.some((order) => order.type === 'DIGITAL' && order.status === 'CONFIRMED' && order.total === 0)) {
    throw new Error('Included collection was not fulfilled correctly');
  }
  if (!included.emails.some((email) => email.kind === 'digital-confirmation' && email.status === 'sent')) {
    throw new Error('Included confirmation email was not accepted by Resend');
  }
  if (paid.gallery?.status !== 'PUBLISHED' || included.gallery?.status !== 'PUBLISHED') {
    throw new Error('Test galleries were not published');
  }
  if (!paid.orders.some((order) => order.type === 'PRINT' && order.status === 'FULFILLED' && order.total === 5400 && order.shippingAddressStored)) {
    throw new Error('Print payment, address, or fulfilment state is incorrect');
  }
  for (const kind of ['gallery-ready', 'print-confirmation', 'print-dispatched']) {
    if (!paid.emails.some((email) => email.kind === kind && email.status === 'sent')) {
      throw new Error(`Missing successful ${kind} email`);
    }
  }

  const includedToken = tokenFor(included);
  const allowedAsset = await fetch(`${appUrl}/api/gallery/${includedToken}/assets/${included.assetIds[0]}`);
  if (!allowedAsset.ok || !allowedAsset.headers.get('content-type')?.startsWith('image/')) {
    throw new Error('An allowed gallery image could not be retrieved');
  }
  const hiddenAsset = await fetch(`${appUrl}/api/gallery/${includedToken}/assets/${included.assetIds[10]}`);
  if (hiddenAsset.status !== 404) throw new Error('Included collection exposed an image beyond its allowance');
  const tamperedToken = `${includedToken.slice(0, -1)}${includedToken.endsWith('a') ? 'b' : 'a'}`;
  const tamperedAccess = await fetch(`${appUrl}/gallery/${tamperedToken}`);
  if (tamperedAccess.status !== 404) throw new Error('A tampered private link was not rejected');

  const publicSummary = (value) => {
    const { id, accessVersion, assetIds, ...rest } = value;
    return rest;
  };
  console.log(JSON.stringify({
    passed: true,
    accessChecks: { allowedAsset: 200, hiddenAsset: 404, tamperedToken: 404 },
    paid: publicSummary(paid),
    included: publicSummary(included),
  }, null, 2));
} finally {
  await prisma.$disconnect();
}
