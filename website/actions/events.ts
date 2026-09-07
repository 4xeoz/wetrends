'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { getStripe } from '@/lib/stripe';
import { createReferralClaim, getAppUrl, getEventConfirmationUrl, getEventGalleryUrl, getEventOfferUrl, verifyReferralClaim } from '@/lib/events/access';
import { getEventJobFromToken, visibleGalleryAssets } from '@/lib/events/queries';
import {
  COMPLETE_STORY_REFERRAL_DISCOUNT_PERCENT,
  PRINT_PRODUCT_MAP,
  STANDARD_SHIPPING_AMOUNT,
  getCompleteStoryReferralPrice,
} from '@/lib/events/catalog';
import { sendEventEmail } from '@/lib/events/email';

const EventEnquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(24),
  eventDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Choose a valid date'),
  location: z.string().trim().min(2).max(200),
  eventType: z.string().trim().min(2).max(100),
  duration: z.string().trim().min(2).max(100),
  media: z.string().trim().min(2).max(100),
  addOns: z.array(z.string().trim().max(100)).max(12),
  details: z.string().trim().max(2000).optional(),
});

const CreateEventJobSchema = z.object({
  leadId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  clientName: z.string().trim().min(2).max(100),
  clientEmail: z.string().trim().email().max(200),
  clientPhone: z.string().trim().max(24).optional(),
  eventTitle: z.string().trim().min(2).max(120),
  eventType: z.string().trim().min(2).max(100),
  eventDate: z.string().optional(),
  location: z.string().trim().max(200).optional(),
  photographerName: z.string().trim().min(2).max(100),
  photographerImage: z.string().trim().max(500).optional(),
  partnerName: z.string().trim().max(100).optional(),
  includedImageCount: z.coerce.number().int().min(1).max(100),
  fullGalleryPrice: z.coerce.number().int().min(0).max(100000),
  retouchingPrice: z.coerce.number().int().min(0).max(100000),
  extraCoverageMinutes: z.coerce.number().int().min(0).max(1440),
  extraCoveragePrice: z.coerce.number().int().min(0).max(100000),
});

const DigitalChoiceSchema = z.object({
  package: z.enum(['INCLUDED', 'FULL']),
  retouching: z.boolean(),
  referralClaim: z.string().trim().max(2000).optional(),
});

const ExternalAssetSchema = z.object({
  eventJobId: z.string().regex(/^[a-f\d]{24}$/i),
  title: z.string().trim().min(1).max(120),
  alt: z.string().trim().min(1).max(240),
  sourceUrl: z.string().trim().refine((value) => value.startsWith('/') || /^https:\/\//.test(value), 'Use a local or HTTPS image URL'),
});

const CloudinaryAssetSchema = z.object({
  eventJobId: z.string().regex(/^[a-f\d]{24}$/i),
  title: z.string().trim().min(1).max(120),
  alt: z.string().trim().min(1).max(240),
  cloudinaryId: z.string().trim().min(1).max(500),
  cloudinaryFormat: z.string().trim().min(1).max(20),
  width: z.number().int().positive().max(30000),
  height: z.number().int().positive().max(30000),
});

const LeadStatusSchema = z.enum(['NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED']);

const PrintCartSchema = z.object({
  items: z.array(z.object({
    assetId: z.string().regex(/^[a-f\d]{24}$/i),
    productId: z.string().min(1).max(80),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(50),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
}

export async function submitEventEnquiry(input: z.infer<typeof EventEnquirySchema>) {
  const parsed = EventEnquirySchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: 'Please check the highlighted details.' };

  try {
    const lead = await prisma.eventLead.create({
      data: {
        ...parsed.data,
        eventDate: new Date(parsed.data.eventDate),
        details: parsed.data.details || null,
      },
    });
    return { success: true as const, leadId: lead.id };
  } catch (error) {
    console.error('[submitEventEnquiry]', error);
    return { success: false as const, message: 'We could not send this enquiry. Please try again.' };
  }
}

export async function createEventJob(input: z.infer<typeof CreateEventJobSchema>) {
  await requireAdmin();
  const parsed = CreateEventJobSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: 'Please check the event details.' };

  const data = parsed.data;
  const job = await prisma.eventJob.create({
    data: {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone || null,
      eventTitle: data.eventTitle,
      eventType: data.eventType,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      location: data.location || null,
      photographerName: data.photographerName,
      photographerImage: data.photographerImage || '/images/eddy-event-photographer-v2.png',
      partnerName: data.partnerName || null,
      includedImageCount: data.includedImageCount,
      fullGalleryPrice: data.fullGalleryPrice,
      retouchingPrice: data.retouchingPrice,
      extraCoverageMinutes: data.extraCoverageMinutes,
      extraCoveragePrice: data.extraCoveragePrice,
      gallery: { create: {} },
    },
  });

  if (data.leadId) {
    await prisma.eventLead.updateMany({
      where: { id: data.leadId },
      data: { status: 'CONVERTED' },
    });
  }

  revalidatePath('/me/events');
  return {
    success: true as const,
    eventJobId: job.id,
    offerUrl: getEventOfferUrl(job.id, job.accessVersion),
  };
}

export async function updateEventLeadStatus(eventLeadId: string, status: z.infer<typeof LeadStatusSchema>) {
  await requireAdmin();
  if (!/^[a-f\d]{24}$/i.test(eventLeadId) || !LeadStatusSchema.safeParse(status).success) {
    return { success: false as const, message: 'Invalid lead update.' };
  }
  await prisma.eventLead.update({ where: { id: eventLeadId }, data: { status } });
  revalidatePath('/me/events');
  return { success: true as const };
}

export async function rotateEventAccess(eventJobId: string) {
  await requireAdmin();
  const job = await prisma.eventJob.update({
    where: { id: eventJobId },
    data: { accessVersion: { increment: 1 } },
  });
  revalidatePath(`/me/events/${eventJobId}`);
  return { success: true as const, offerUrl: getEventOfferUrl(job.id, job.accessVersion) };
}

export async function sendEventOffer(eventJobId: string, recipientOverride?: string, deliveryId?: string) {
  await requireAdmin();
  const job = await prisma.eventJob.findUnique({ where: { id: eventJobId } });
  if (!job) return { success: false as const, message: 'Event not found.' };

  const recipient = recipientOverride?.trim() || job.clientEmail;
  const offerUrl = getEventOfferUrl(job.id, job.accessVersion);
  const result = await sendEventEmail({
    eventJobId: job.id,
    recipient,
    clientName: job.clientName,
    kind: 'offer',
    subject: `Your ${job.eventTitle} photographs`,
    preview: 'Your photographs are ready for you to choose how they should be finished.',
    eyebrow: 'Your photographs',
    heading: 'Choose how you’d like them finished.',
    body: `${job.photographerName} has completed the shoot. Your included collection is covered, and you can now choose exactly how you would like us to prepare your photographs.`,
    detailLines: [
      `${job.includedImageCount} professionally edited photographs${job.partnerName ? `, courtesy of ${job.partnerName}` : ''}`,
      'Colour, exposure and crop correction on every photograph',
    ],
    guidanceTitle: 'Three quick steps',
    guidanceSteps: [
      {
        title: 'Choose your collection',
        description: 'Keep the included set or unlock the complete story.',
      },
      {
        title: 'Choose your finish',
        description: 'Use the included edit or add Signature Retouching.',
      },
      {
        title: 'Review and confirm',
        description: 'You only pay if you select an upgrade.',
      },
    ],
    buttonLabel: 'View my choices',
    buttonUrl: offerUrl,
    actionNote: 'This private link was created for you.',
    idempotencyKey: `offer-${job.id}-${job.accessVersion}-${recipient}-${deliveryId || 'initial'}`,
  });

  if (result.success) {
    await prisma.eventJob.update({ where: { id: job.id }, data: { status: 'OFFER_SENT', offerSentAt: new Date() } });
    revalidatePath(`/me/events/${job.id}`);
  }
  return result;
}

export async function addExternalGalleryAsset(input: z.infer<typeof ExternalAssetSchema>) {
  await requireAdmin();
  const parsed = ExternalAssetSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: 'Please provide valid image details.' };

  const gallery = await prisma.eventGallery.findUnique({
    where: { eventJobId: parsed.data.eventJobId },
    include: { _count: { select: { assets: true } } },
  });
  if (!gallery) return { success: false as const, message: 'Gallery not found.' };

  const asset = await prisma.galleryAsset.create({
    data: {
      galleryId: gallery.id,
      title: parsed.data.title,
      alt: parsed.data.alt,
      sourceUrl: parsed.data.sourceUrl,
      sortOrder: gallery._count.assets,
    },
  });
  revalidatePath(`/me/events/${parsed.data.eventJobId}`);
  return { success: true as const, assetId: asset.id };
}

export async function addCloudinaryGalleryAsset(input: z.infer<typeof CloudinaryAssetSchema>) {
  await requireAdmin();
  const parsed = CloudinaryAssetSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: 'The uploaded image details are invalid.' };

  const gallery = await prisma.eventGallery.findUnique({
    where: { eventJobId: parsed.data.eventJobId },
    include: { _count: { select: { assets: true } } },
  });
  if (!gallery) return { success: false as const, message: 'Gallery not found.' };

  const asset = await prisma.galleryAsset.create({
    data: {
      galleryId: gallery.id,
      title: parsed.data.title,
      alt: parsed.data.alt,
      provider: 'cloudinary',
      cloudinaryId: parsed.data.cloudinaryId,
      cloudinaryFormat: parsed.data.cloudinaryFormat,
      width: parsed.data.width,
      height: parsed.data.height,
      sortOrder: gallery._count.assets,
    },
  });
  revalidatePath(`/me/events/${parsed.data.eventJobId}`);
  return { success: true as const, assetId: asset.id };
}

export async function publishEventGallery(eventJobId: string, recipientOverride?: string, deliveryId?: string) {
  await requireAdmin();
  const job = await prisma.eventJob.findUnique({
    where: { id: eventJobId },
    include: { gallery: { include: { _count: { select: { assets: true } } } } },
  });
  if (!job?.gallery) return { success: false as const, message: 'Gallery not found.' };
  if (job.gallery._count.assets < 1) return { success: false as const, message: 'Add at least one photograph before publishing.' };
  if (!job.selectedPackage) return { success: false as const, message: 'The client must confirm a collection first.' };

  await prisma.$transaction([
    prisma.eventGallery.update({ where: { id: job.gallery.id }, data: { status: 'PUBLISHED', publishedAt: new Date() } }),
    prisma.eventJob.update({ where: { id: job.id }, data: { status: 'GALLERY_READY' } }),
  ]);

  const recipient = recipientOverride?.trim() || job.clientEmail;
  const galleryUrl = getEventGalleryUrl(job.id, job.accessVersion);
  const emailResult = await sendEventEmail({
    eventJobId: job.id,
    recipient,
    clientName: job.clientName,
    kind: 'gallery-ready',
    subject: `Your ${job.eventTitle} gallery is ready`,
    preview: 'Your private gallery is ready to view and download.',
    eyebrow: 'Your gallery is ready',
    heading: 'Your photographs are here.',
    body: 'Your finished photographs are ready in your private gallery.',
    guidanceSteps: [
      {
        title: 'Open your gallery',
        description: 'View every photograph included in your collection.',
      },
      {
        title: 'Choose frames or skip',
        description: 'See print options first, or continue without ordering.',
      },
      {
        title: 'Select and download',
        description: 'Choose individual photographs or download them all.',
      },
    ],
    buttonLabel: 'Open private gallery',
    buttonUrl: galleryUrl,
    actionNote: 'Keep this email so you can return to your gallery later.',
    idempotencyKey: `gallery-ready-${job.id}-${job.gallery.id}-${recipient}-${deliveryId || 'initial'}`,
  });

  revalidatePath(`/me/events/${job.id}`);
  revalidatePath(`/gallery/${galleryUrl.split('/').pop()}`);
  return { success: true as const, emailSent: emailResult.success, galleryUrl };
}

export async function createEventReferralClaim(token: string) {
  const job = await getEventJobFromToken(token);
  if (!job) return { success: false as const, message: 'This private link is no longer valid.' };
  if (job.selectedPackage) return { success: false as const, message: 'Your collection is already confirmed.' };
  return { success: true as const, claim: createReferralClaim(token) };
}

export async function createDigitalCheckout(token: string, input: z.infer<typeof DigitalChoiceSchema>) {
  const parsed = DigitalChoiceSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: 'Choose a valid collection.' };

  const job = await getEventJobFromToken(token);
  if (!job) return { success: false as const, message: 'This private link is no longer valid.' };
  if (job.selectedPackage && ['IN_PRODUCTION', 'GALLERY_READY', 'COMPLETED'].includes(job.status)) {
    return { success: true as const, checkout: 'confirmed' as const, url: `${getAppUrl()}/events/client/${token}/confirmed` };
  }

  const referralClaim = parsed.data.referralClaim ? verifyReferralClaim(parsed.data.referralClaim) : null;
  if (parsed.data.referralClaim && (!referralClaim || referralClaim.token !== token)) {
    return { success: false as const, message: 'Your referral offer has expired. Share again to unlock 30% off.' };
  }
  const referralDiscountApplied = parsed.data.package === 'FULL' && Boolean(referralClaim);
  const completeStoryPrice = referralDiscountApplied
    ? getCompleteStoryReferralPrice(job.fullGalleryPrice)
    : job.fullGalleryPrice;

  const lines: Array<Record<string, unknown>> = [];
  lines.push({
    id: parsed.data.package === 'FULL' ? 'gallery_full' : 'gallery_included',
    kind: 'gallery',
    package: parsed.data.package,
    name: parsed.data.package === 'FULL' ? 'Complete Story · full edited gallery' : `Included Collection · ${job.includedImageCount} edited photographs`,
    unitAmount: parsed.data.package === 'FULL' ? completeStoryPrice : 0,
    quantity: 1,
    ...(referralDiscountApplied ? {
      originalUnitAmount: job.fullGalleryPrice,
      discountPercent: COMPLETE_STORY_REFERRAL_DISCOUNT_PERCENT,
    } : {}),
  });
  if (parsed.data.retouching && job.retouchingPrice > 0) {
    lines.push({ id: 'signature_retouching', kind: 'retouching', name: 'Signature Retouching', unitAmount: job.retouchingPrice, quantity: 1 });
  }
  if (job.extraCoveragePrice > 0 && job.extraCoverageMinutes > 0) {
    lines.push({ id: 'extra_coverage', kind: 'coverage', name: `Additional coverage · ${job.extraCoverageMinutes} minutes`, unitAmount: job.extraCoveragePrice, quantity: 1 });
  }

  const total = lines.reduce((sum, line) => sum + Number(line.unitAmount) * Number(line.quantity), 0);
  const order = await prisma.eventOrder.create({
    data: {
      eventJobId: job.id,
      type: 'DIGITAL',
      status: total === 0 ? 'CONFIRMED' : 'CREATED',
      paymentMethod: total === 0 ? 'complimentary' : 'stripe',
      customerEmail: job.clientEmail,
      currency: job.currency,
      subtotal: total,
      total,
      items: lines as Prisma.InputJsonValue,
    },
  });

  if (total === 0) {
    await prisma.eventJob.update({
      where: { id: job.id },
      data: {
        selectedPackage: parsed.data.package,
        retouchingSelected: parsed.data.retouching,
        status: 'IN_PRODUCTION',
        productionStartedAt: new Date(),
      },
    });
    await sendEventEmail({
      eventJobId: job.id,
      recipient: job.clientEmail,
      clientName: job.clientName,
      kind: 'digital-confirmation',
      subject: `Your ${job.eventTitle} choices are confirmed`,
      preview: 'Your choices are confirmed and editing can begin.',
      eyebrow: 'Choices confirmed',
      heading: 'We have everything we need.',
      body: 'Your collection is confirmed. Our team can now begin preparing your photographs.',
      detailLines: lines.map((line) => String(line.name)),
      guidanceSteps: [
        {
          title: 'Editing begins',
          description: 'We prepare each photograph using the finish you selected.',
        },
        {
          title: 'We review everything',
          description: 'Your collection receives a final quality check.',
        },
        {
          title: 'Your gallery arrives by email',
          description: 'We send one private link when your photographs are ready.',
        },
      ],
      buttonLabel: 'View my confirmation',
      buttonUrl: getEventConfirmationUrl(job.id, job.accessVersion, order.id),
      actionNote: 'No further action is needed right now.',
      idempotencyKey: `digital-confirmation-${order.id}`,
    });
    return { success: true as const, checkout: 'confirmed' as const, url: `${getAppUrl()}/events/client/${token}/confirmed?order_id=${order.id}` };
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: job.clientEmail,
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
      eventJobId: job.id,
      orderType: 'DIGITAL',
      referralDiscountPercent: referralDiscountApplied ? String(COMPLETE_STORY_REFERRAL_DISCOUNT_PERCENT) : '0',
    },
    line_items: lines.filter((line) => Number(line.unitAmount) > 0).map((line) => ({
      quantity: Number(line.quantity),
      price_data: {
        currency: job.currency,
        unit_amount: Number(line.unitAmount),
        product_data: { name: String(line.name) },
      },
    })),
    success_url: `${getAppUrl()}/events/client/${token}/confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getAppUrl()}/events/client/${token}?cancelled=1`,
  });

  await prisma.$transaction([
    prisma.eventOrder.update({ where: { id: order.id }, data: { status: 'CHECKOUT_PENDING', stripeCheckoutSessionId: session.id } }),
    prisma.eventJob.update({ where: { id: job.id }, data: { status: 'AWAITING_PAYMENT' } }),
  ]);

  if (!session.url) throw new Error('Stripe Checkout did not return a hosted payment URL');
  return { success: true as const, checkout: 'stripe' as const, url: session.url };
}

export async function createPrintCheckout(token: string, input: z.infer<typeof PrintCartSchema>) {
  const parsed = PrintCartSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: 'Check your print selection.' };

  const job = await getEventJobFromToken(token);
  if (!job?.gallery || job.gallery.status !== 'PUBLISHED' || !job.selectedPackage) {
    return { success: false as const, message: 'This gallery is not ready for print orders.' };
  }

  const visibleAssets = visibleGalleryAssets(job.gallery.assets, job.selectedPackage, job.includedImageCount);
  const assetMap = new Map(visibleAssets.map((asset) => [asset.id, asset]));
  const consolidated = new Map<string, { assetId: string; productId: string; quantity: number }>();
  for (const item of parsed.data.items) {
    if (!assetMap.has(item.assetId) || !PRINT_PRODUCT_MAP.has(item.productId)) {
      return { success: false as const, message: 'One of the selected photographs or print sizes is unavailable.' };
    }
    const key = `${item.assetId}:${item.productId}`;
    const current = consolidated.get(key);
    consolidated.set(key, { ...item, quantity: Math.min(20, (current?.quantity || 0) + item.quantity) });
  }

  const lines = [...consolidated.values()].map((item) => {
    const asset = assetMap.get(item.assetId);
    const product = PRINT_PRODUCT_MAP.get(item.productId);
    if (!asset || !product) throw new Error('Validated print selection became unavailable');
    return {
      id: `${product.id}:${asset.id}`,
      kind: 'print',
      assetId: asset.id,
      productId: product.id,
      name: `${product.name} · ${asset.title}`,
      unitAmount: product.unitAmount,
      quantity: item.quantity,
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
  const shippingAmount = STANDARD_SHIPPING_AMOUNT;
  const selectedProductIds = [...new Set(lines.map((line) => line.productId))].join(',');

  const order = await prisma.eventOrder.create({
    data: {
      eventJobId: job.id,
      type: 'PRINT',
      status: 'CREATED',
      customerEmail: job.clientEmail,
      currency: job.currency,
      subtotal,
      shippingAmount,
      total: subtotal + shippingAmount,
      items: lines as Prisma.InputJsonValue,
    },
  });

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    phone_number_collection: { enabled: true },
    shipping_address_collection: { allowed_countries: ['GB'] },
    shipping_options: [{
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: { amount: shippingAmount, currency: job.currency },
        display_name: 'Tracked UK delivery',
      },
    }],
    client_reference_id: order.id,
    metadata: { orderId: order.id, eventJobId: job.id, orderType: 'PRINT' },
    line_items: lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: job.currency,
        unit_amount: line.unitAmount,
        product_data: { name: line.name },
      },
    })),
    success_url: `${getAppUrl()}/gallery/${token}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getAppUrl()}/gallery/${token}/prints/select?cancelled=1&products=${encodeURIComponent(selectedProductIds)}`,
  });

  await prisma.eventOrder.update({
    where: { id: order.id },
    data: { status: 'CHECKOUT_PENDING', stripeCheckoutSessionId: session.id },
  });

  if (!session.url) throw new Error('Stripe Checkout did not return a hosted payment URL');
  return { success: true as const, url: session.url };
}

export async function markPrintOrderFulfilled(orderId: string) {
  await requireAdmin();
  const order = await prisma.eventOrder.findUnique({ where: { id: orderId } });
  if (!order || order.type !== 'PRINT') return { success: false as const, message: 'Print order not found.' };
  const updated = await prisma.eventOrder.update({
    where: { id: order.id },
    data: { status: 'FULFILLED', fulfilledAt: new Date() },
    include: { eventJob: true },
  });
  const delivery = updated.shippingAddress as { name?: unknown } | null;
  const recipientName = typeof delivery?.name === 'string' ? delivery.name : updated.eventJob.clientName;
  await sendEventEmail({
    eventJobId: updated.eventJobId,
    recipient: updated.customerEmail,
    clientName: recipientName,
    kind: 'print-dispatched',
    subject: 'Your WeTrends prints are on their way',
    preview: 'Your print order has left the studio and is on its way.',
    eyebrow: 'Prints dispatched',
    heading: 'Your order is on its way.',
    body: 'Your prints have left the studio. Please check the parcel when it arrives and reply to this email if anything is not right.',
    guidanceTitle: 'While you wait',
    guidanceSteps: [
      {
        title: 'Keep an eye on delivery',
        description: 'Your order is now with the delivery service.',
      },
      {
        title: 'Check your prints',
        description: 'Open the parcel and make sure everything arrived safely.',
      },
    ],
    buttonLabel: 'View my gallery',
    buttonUrl: getEventGalleryUrl(updated.eventJob.id, updated.eventJob.accessVersion),
    actionNote: 'Your private gallery remains available from this link.',
    idempotencyKey: `print-dispatched-${updated.id}`,
  });
  revalidatePath('/me/print-orders');
  return { success: true as const };
}
