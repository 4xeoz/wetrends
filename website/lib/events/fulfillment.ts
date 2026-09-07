import 'server-only';
import type Stripe from 'stripe';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/prisma/prisma';
import { getStripe } from '@/lib/stripe';
import { getEventConfirmationUrl, getEventGalleryUrl } from './access';
import { formatMoney } from './catalog';
import { sendEventEmail } from './email';

type OrderLine = {
  id: string;
  kind: string;
  name: string;
  unitAmount: number;
  quantity: number;
  package?: 'INCLUDED' | 'FULL';
  assetId?: string;
};

function readLines(value: unknown): OrderLine[] {
  return Array.isArray(value) ? value.filter((line): line is OrderLine => Boolean(line && typeof line === 'object')) : [];
}

function shippingAddress(session: Stripe.Checkout.Session) {
  const details = session.collected_information?.shipping_details;
  if (!details) return undefined;
  return {
    name: details.name,
    address: {
      line1: details.address.line1,
      line2: details.address.line2,
      city: details.address.city,
      state: details.address.state,
      postalCode: details.address.postal_code,
      country: details.address.country,
    },
  } as Prisma.InputJsonValue;
}

export async function fulfillCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    return { fulfilled: false as const, reason: 'payment_not_complete' };
  }

  const orderId = session.metadata?.orderId || session.client_reference_id;
  if (!orderId) throw new Error('Stripe Checkout Session is missing an order reference');

  const order = await prisma.eventOrder.findUnique({
    where: { id: orderId },
    include: { eventJob: true },
  });
  if (!order) throw new Error('Order referenced by Stripe was not found');

  const amountTotal = session.amount_total;
  const sessionCurrency = session.currency?.toLowerCase();
  if (amountTotal === null || amountTotal !== order.total) {
    throw new Error('Stripe Checkout amount does not match the order total');
  }
  if (!sessionCurrency || sessionCurrency !== order.currency.toLowerCase()) {
    throw new Error('Stripe Checkout currency does not match the order currency');
  }

  const purchaserEmail = order.type === 'PRINT'
    ? session.customer_details?.email?.trim() || order.customerEmail
    : order.customerEmail;
  const purchaserName = order.type === 'PRINT'
    ? session.collected_information?.shipping_details?.name || order.eventJob.clientName
    : order.eventJob.clientName;
  const collectedShippingAddress = shippingAddress(session);

  if (order.status === 'PAID' || order.status === 'PROCESSING' || order.status === 'FULFILLED') {
    if (order.type === 'PRINT' && (order.customerEmail !== purchaserEmail || (!order.shippingAddress && collectedShippingAddress))) {
      const reconciledOrder = await prisma.eventOrder.update({
        where: { id: order.id },
        data: {
          customerEmail: purchaserEmail,
          ...(collectedShippingAddress ? { shippingAddress: collectedShippingAddress } : {}),
        },
        include: { eventJob: true },
      });
      return { fulfilled: true as const, order: reconciledOrder, alreadyProcessed: true as const };
    }
    return { fulfilled: true as const, order, alreadyProcessed: true as const };
  }

  const lines = readLines(order.items);
  const amountShipping = session.total_details?.amount_shipping ?? order.shippingAmount;
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  const nextOrderStatus = order.type === 'PRINT' ? 'PROCESSING' : 'PAID';

  const updatedOrder = await prisma.eventOrder.update({
    where: { id: order.id },
    data: {
      status: nextOrderStatus,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      customerEmail: purchaserEmail,
      shippingAmount: amountShipping,
      total: amountTotal,
      shippingAddress: collectedShippingAddress,
      paidAt: new Date(),
    },
  });

  if (order.type === 'DIGITAL') {
    const packageLine = lines.find((line) => line.kind === 'gallery');
    const selectedPackage = packageLine?.package === 'FULL' ? 'FULL' : 'INCLUDED';
    const retouchingSelected = lines.some((line) => line.kind === 'retouching');

    await prisma.eventJob.update({
      where: { id: order.eventJobId },
      data: {
        selectedPackage,
        retouchingSelected,
        status: 'IN_PRODUCTION',
        productionStartedAt: order.eventJob.productionStartedAt ?? new Date(),
      },
    });

    await sendEventEmail({
      eventJobId: order.eventJobId,
      recipient: updatedOrder.customerEmail,
      clientName: purchaserName,
      kind: 'digital-confirmation',
      subject: `Payment confirmed — your ${order.eventJob.eventTitle} photographs`,
      preview: 'Payment received. Your photographs are now being prepared.',
      eyebrow: 'Payment confirmed',
      heading: 'We have everything we need.',
      body: 'Your payment and choices are confirmed. Our team can now begin preparing your photographs.',
      detailLines: [
        ...lines.map((line) => `${line.name}${line.quantity > 1 ? ` × ${line.quantity}` : ''}`),
        `Paid: ${formatMoney(amountTotal, order.currency)}`,
      ],
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
      buttonUrl: getEventConfirmationUrl(order.eventJob.id, order.eventJob.accessVersion, order.id),
      actionNote: 'No further action is needed right now.',
      idempotencyKey: `digital-confirmation-${order.id}`,
    });
  } else {
    await sendEventEmail({
      eventJobId: order.eventJobId,
      recipient: updatedOrder.customerEmail,
      clientName: purchaserName,
      kind: 'print-confirmation',
      subject: 'Your WeTrends print order is confirmed',
      preview: 'Your print order and delivery details are confirmed.',
      eyebrow: 'Print order received',
      heading: 'Your print order is confirmed.',
      body: 'We received your selected photographs and delivery details. Your order is now moving into production.',
      detailLines: [
        ...lines.map((line) => `${line.name} × ${line.quantity}`),
        `Paid: ${formatMoney(amountTotal, order.currency)}`,
      ],
      guidanceSteps: [
        {
          title: 'We prepare your order',
          description: 'Your selected photographs are prepared for print.',
        },
        {
          title: 'We quality-check it',
          description: 'Every item is checked before it leaves the studio.',
        },
        {
          title: 'We email you at dispatch',
          description: 'You will hear from us again as soon as it is on the way.',
        },
      ],
      buttonLabel: 'View my gallery',
      buttonUrl: getEventGalleryUrl(order.eventJob.id, order.eventJob.accessVersion),
      actionNote: 'No further action is needed right now.',
      idempotencyKey: `print-confirmation-${order.id}`,
    });
  }

  return { fulfilled: true as const, order: updatedOrder, alreadyProcessed: false as const };
}
